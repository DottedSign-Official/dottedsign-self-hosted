class SignTask < ApplicationRecord
  belongs_to :owner, class_name: 'Member', foreign_key: :owner_id
  belongs_to :bulk_mission, optional: true
  belongs_to :envelope, optional: true
  belongs_to :public_form, optional: true

  has_many :sign_stages, -> { display_order }, dependent: :destroy
  has_many :dummy_stages, -> { display_order }, as: :source, dependent: :destroy
  has_many :sign_events, dependent: :destroy
  has_many :xfdf_documents, as: :source, dependent: :destroy
  has_many :processing_stages, -> { processing }, class_name: 'SignStage'
  has_one :task_setting, dependent: :destroy
  has_many :field_settings, as: :source, dependent: :destroy
  has_many :field_setting_groups, as: :source, dependent: :destroy
  has_many :review_logs, as: :source, dependent: :destroy
  has_many :sign_logs, as: :source, dependent: :destroy
  has_one :decline_log, dependent: :destroy
  has_many :modified_events, -> { modified_action }, class_name: 'SignEvent'
  has_many :change_events, -> { where(action_name: 'signer_changed') }, class_name: 'SignEvent'
  has_many :callbacks, as: :source, dependent: :destroy

  acts_as_taggable

  enum status: ['draft', 'waiting', 'completed', 'deleted', 'expired', 'declined']
  enum sign_type: ['create_and_invite', 'sign_and_send', 'kiosk', 'form']
  enum file_status: ['file_exist', 'deleted_all_file', 'deleted_before_complete_file']

  scope :active, -> { where.not(status: statuses['deleted']) }
  scope :cancel, -> { where(status: [:expired, :declined]) }
  scope :ready, -> { joins(:uploaded_files).where(service_files: { label: ['original', 'full'] }).group(:id).having('count(*) = 2') }
  scope :expire_soon, -> { waiting.joins(:task_setting).where.not(task_settings: { deadline: nil }).where(task_settings: { deadline: Time.zone.now..1.week.after }) }
  scope :independent, -> { where(envelope_id: nil) }
  scope :non_form, -> { where.not(sign_type: :form) }

  before_validation :setup_long_id, on: :create
  before_validation :setup_modified_at, on: :create
  after_commit :mark_sign_event, on: :update, if: :status_previously_changed?
  after_commit :clear_cache, if: :status_previously_changed?
  after_commit :apply_watermark, if: :status_previously_changed?
  after_commit :status_change_notify, on: :update, if: :status_previously_changed?
  after_commit :delete_dependency_file, on: :update, if: ->(task) { task.deleted_all_file? }

  alias :setting :task_setting

  START_CHECK_DURATION = 2.seconds
  GEN_FILE_RETRY_DURATION = 5.seconds
  NOTIFIABLE_STATUS = %w[completed deleted expired].freeze

  prepend ::Groupable
  include Accessible
  include Actionable
  include Auditable
  include Callbackable
  include CustomTaggable
  include Displayable
  include Referenceable
  include Remindable
  include Searchable
  include Signable
  include Sortable
  include Storable
  include TaskRelated::Duplicable
  include TaskRelated::Reissuable
  include TaskRelated::Info::SignTask
  include GroupDisplayable if GROUP_USE
  include GroupSearchable if GROUP_USE
  include GroupActionable if GROUP_USE
  include Reportable if GROUP_USE
  include Transferable

  class << self

    def create_from_request(task_info, client_info, setting_info = {}, skip_original_upload_link: false)
      ActiveRecord::Base.transaction do
        task = create(task_info.slice(*SignTask.column_names))
        task.add_sign_event(:created, task.owner_id, client_info: client_info)
        case task.sign_type
        when 'create_and_invite'
          SignStage.setup_from_request(task.owner_id, task.id, task_info[:stages], has_order: task.has_order)
          TaskSetting.setup_from_request(task.owner_id, task.id, setting_info)
        when 'sign_and_send'
          stages = DummyStage.setup_from_request(task.sign_type, task.id, task_info[:stages])
          attachment_upload_infos = stages.map { |stage| [stage.actor_display_name, stage.attachment_upload_infos] }.to_h
          if Settings.default.ca.ca_enable
            setting_info[:need_ca] = true
            TaskSetting.setup_from_request(task.owner_id, task.id, setting_info)
          end
        end

        info = task.display(task.owner_id)
        info[:upload_link] = task.upload_link_for('original') unless skip_original_upload_link
        info[:reference_upload_links] = task.reference_upload_links
        info[:completed_reference_upload_links] = task.completed_reference_upload_links
        info[:attachment_upload_infos] = attachment_upload_infos
        info
      end
    end

  end

  def update_from_request(task_info, client_info, setting_info = {})
    ActiveRecord::Base.transaction do
      self.assign_attributes(task_info.slice(*SignTask.column_names))
      self.modified_at = Time.zone.now
      self.save!
      add_sign_event(:modified, owner_id, client_info: client_info)
      if task_info[:stages].present?
        SignStage.setup_from_request(owner_id, id, task_info[:stages], has_order: has_order)
        PdfFormGenerateWorker.perform_async('SignTask', id)
      end
      TaskSetting.setup_from_request(owner_id, id, setting_info) if setting_info.present?
      self.reload
      info = display(owner_id)
      info[:reference_upload_links] = reference_upload_links unless references_ready?
      info[:completed_reference_upload_links] = completed_reference_upload_links unless completed_references_ready?
      info
    end
  end

  def is_dummy?
    sign_and_send? || kiosk?
  end

  def deletable?
    is_dummy? || !completed?
  end

  def start(client_info)
    start_from = client_info.transform_values { |value| value || :unknow }
    start_from[:time_zone] = owner.preference_info[:time_zone] || TimezoneMapping[:hour_zone].default
    self.start_from = start_from
    before_waiting
    self.save!
  end

  def before_waiting
    if can_start_now?
      kiosk? ? do_kiosk_waiting : do_waiting
    elsif has_try_to_start?
      StartCheckWorker.perform_in(START_CHECK_DURATION, id)
    end
  end

  def do_waiting
    if has_order?
      stage = sign_stages.find_by(sequence: 1)
      stage.do_processing
    else
      sign_stages.action_sign.each(&:do_processing)
    end
    owner.increase_monthly_task_usage!
    self.waiting!
    Notification::StartMailWorker.perform_async(id) if need_cc? && !in_envelope?
    add_sign_event(:sent, owner_id, client_info: start_from.symbolize_keys)
  end

  def do_kiosk_waiting
    stage = dummy_stages.find_by(sequence: 1)
    stage.processing!
    self.waiting!
    add_sign_event(:sent, owner_id, client_info: start_from.symbolize_keys)
  end

  def before_completed
    return unless waiting?
    SystemtimeFiller.call(self)
    SignTaskProcess::CompletedFileSetup.call(self)
  end

  def do_completed
    self.completed_at = Time.zone.now
    self.completed!
    TaskCompletedProcessWorker.perform_async(id, callback: !in_envelope?)
    trigger_completed_mission
    trigger_completed_form
    mark_task_completed if in_envelope?
  end

  def do_declined
    return unless waiting? && sign_stages.declined.count >= 1
    sign_stages.on_going.update_all(status: SignStage.statuses[:canceled])
    self.declined!
    AuditTrailGenerateWorker.perform_async(id)
    trigger_completed_mission
  end

  def do_deleted
    self.deleted!
    self.deleted_all_file!
  end

  def can_start_now?
    return false unless draft? && start_from.present?
    return false unless original_file.present? && full_file.present?
    return false unless xfdf_ready?
    return false unless references_ready? && completed_references_ready?
    true
  end

  def has_try_to_start?
    draft? && start_from.present?
  end

  def xfdf_ready?
    return false if full_file.nil? || xfdf_documents.blank?
    normal_stages.pluck(:id) - xfdf_documents.pluck(:stage_id) == []
  end

  def references_ready?
    return true if reference_setting.blank?

    uploaded_reference_ids = reference_files.pluck(:label)
    require_reference_ids = reference_setting.pluck('reference_id')
    (require_reference_ids - uploaded_reference_ids).blank?
  end

  def completed_references_ready?
    return true if completed_reference_setting.blank?

    uploaded_completed_reference_ids = completed_reference_files.pluck(:label)
    require_completed_reference_ids = completed_reference_setting.pluck('reference_id')
    (require_completed_reference_ids - uploaded_completed_reference_ids).blank?
  end

  def need_cc?
    task_setting&.cc_info.present?
  end

  def trigger_completed_mission
    bulk_mission.before_completed if bulk_mission_id.present?
  end

  def trigger_completed_form
    public_form.finish_form if public_form_id.present?
  end

  def category_for_owner_after_start
    first_step_stage_sequence = sign_stages.order(:sequence).first.sequence
    first_step_stage_emails = sign_stages.where(sequence: first_step_stage_sequence).pluck(:email)
    first_step_stage_emails.include?(owner.email) ? :waiting_for_me : :waiting_for_other
  end

  def delete_dependency_file(except_label: [])
    service_files.where.not(label: except_label).each(&:delete_file)
    sign_stages.each do |sign_stage|
      sign_stage.service_files.each(&:delete_file)
    end
    Signature.photo_category.where("other_info ->> 'field_setting_id' IN (?)", field_settings.pluck(:id).map(&:to_s)).destroy_all
    GuestSignature.photo_category.where("other_info ->> 'field_setting_id' IN (?)", field_settings.pluck(:id).map(&:to_s)).destroy_all
  end

  def obtain_all_service_file_ids
    service_files.pluck(:id) + sign_stages.map(&:service_file_ids).flatten
  end

  def in_envelope?
    envelope_id.present?
  end

  def increase_public_form_sent_num!
    public_form.increment!(:sent_num)
  end

  private

  def setup_long_id
    self.long_id = loop do
      uuid = SecureRandom.uuid
      break uuid if SignTask.find_by_long_id(uuid).nil?
    end
  end

  def setup_modified_at
    self.modified_at ||= Time.zone.now
  end

  def mark_sign_event
    SignEvent.where(sign_task_id: id).update_all(task_deleted: true) if deleted?
    SignEvent.where(sign_task_id: id).update_all(task_expired: true) if expired?
  end

  def status_change_notify
    notify_member_ids = related_member_ids
    SocketCenter.broadcast_to_many(notify_member_ids, event: 'task_status_change', payload: { task_id: id })
    return if NOTIFIABLE_STATUS.exclude?(status)
    notify_event = "task_#{status.chop}"
    SocketCenter.broadcast_to_many(notify_member_ids, event: notify_event, payload: { task_id: id })
    notify_member_ids.each do |member_id|
      NotificationCenter.delay.raise_if_server_failed('target_push', 'task_request', member_id, push_notify_info)
    end if create_and_invite?
  end

  def clear_cache
    Rails.cache.delete_matched("task:#{id}:*") if deleted?
  end

  def apply_watermark
    WatermarkApplyWorker.perform_async(id, 'expired') if expired?
  end

  def mark_task_completed
    Rails.cache.write("envelope:#{envelope_id}:task:#{id}:completed", true)
  end

end
