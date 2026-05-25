class Envelope < ApplicationRecord
  belongs_to :owner, class_name: 'Member', foreign_key: :owner_id
  has_many :sign_tasks, dependent: :destroy
  has_many :dummy_stages, -> { display_order }, as: :source, dependent: :destroy
  has_many :processing_stages, -> { processing }, as: :source, class_name: 'DummyStage'
  has_many :sign_events, dependent: :destroy
  has_many :change_events, -> { where(action_name: 'signer_changed') }, class_name: 'SignEvent'
  has_many :modified_events, -> { modified_action }, class_name: 'SignEvent'
  has_one :envelope_setting, dependent: :destroy
  has_many :callbacks, as: :source, dependent: :destroy

  acts_as_taggable

  enum status: [:draft, :waiting, :completed, :deleted, :expired, :declined]
  enum sign_type: [:create_and_invite]

  scope :active, -> { where.not(status: statuses['deleted']) }
  scope :cancel, -> { where(status: [:expired, :declined]) }
  scope :ready, -> { joins(:uploaded_files).where(service_files: { label: 'original' }) }
  scope :expire_soon, -> { waiting.joins(:envelope_setting).where.not(envelope_setting: { deadline: nil }).where(envelope_setting: { deadline: Time.zone.now..1.week.after }) }
  scope :display_order, -> { order(modified_at: :desc, id: :desc) }

  before_validation :setup_long_id, on: :create
  before_validation :setup_modified_at, on: :create
  after_commit :mark_sign_event, on: :update, if: :status_previously_changed?
  after_commit :clear_cache, if: :status_previously_changed?
  after_commit :status_change_notify, on: :update, if: :status_previously_changed?
  after_commit :clear_first_task_cache, if: :sign_task_position_changed?

  alias :setting :envelope_setting
  alias_attribute :file_name, :envelope_name

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
  include Storable
  include TaskRelated::Duplicable
  include TaskRelated::Reissuable
  include TaskRelated::Info::Envelope
  include GroupSearchable if GROUP_USE
  include Transferable

  class << self

    def create_from_request(envelope_info, client_info, setting_info = {})
      envelope = create(envelope_info.slice(*Envelope.column_names))
      envelope.add_sign_event(:created, envelope.owner_id, client_info: client_info)
      case envelope.sign_type
      when 'create_and_invite'
        DummyStage.setup_from_envelope(envelope.id, envelope_info[:stages])
        EnvelopeSetting.setup_from_request(envelope.owner_id, envelope.id, setting_info)
      end
      Envelope.setup_file_for(envelope, 'original')

      info = envelope.display(envelope.owner_id)
      info[:reference_upload_links] = envelope.reference_upload_links
      info[:completed_reference_upload_links] = envelope.completed_reference_upload_links
      info
    end

    def setup_file_for(target, label)
      file = ServiceFile.setup_for(target, label)
      file.update!(uploaded_at: Time.zone.now)
    end

  end

  def update_from_request(envelope_info, client_info, setting_info = {})
    self.assign_attributes(envelope_info.slice(*Envelope.column_names))
    self.modified_at = Time.zone.now
    self.save!
    add_sign_event(:modified, owner_id, client_info: client_info)
    DummyStage.setup_from_envelope(id, envelope_info[:stages]) if envelope_info[:stages].present?
    EnvelopeSetting.setup_from_request(owner_id, id, setting_info) if setting_info.present?

    self.reload
    info = display(owner_id)
    info[:reference_upload_links] = reference_upload_links unless references_ready?
    info[:completed_reference_upload_links] = completed_reference_upload_links unless completed_references_ready?
    info
  end

  def is_dummy?
    false
  end

  def sign_and_send?
    false
  end

  def deletable?
    !completed?
  end

  def start(client_info)
    self.start_from = client_info.transform_values { |value| value || :unknow }
    before_waiting
    self.save!
  end

  def do_waiting
    if has_order?
      dummy_stages.find_by(sequence: 1).do_processing
    else
      dummy_stages.each(&:do_processing)
    end
    self.waiting!
    Notification::StartMailWorker.perform_async(id, self.class.name) if need_cc?
    add_sign_event(:sent, owner_id, client_info: start_from.symbolize_keys)
  end

  def before_completed
    return unless waiting?
    if can_complete_now?
      do_completed
    elsif has_try_to_complete?
      CompleteCheckWorker.perform_in(SignTask::START_CHECK_DURATION, id)
    end
  end

  def do_completed
    self.completed_at = Time.zone.now
    self.completed!
    setup_needed_files
    Notification::CompletedMailWorker.perform_async(self.id, self.class.name)
    CallbackWorker.perform_async('Envelope', self.id)
  end

  def do_declined
    return unless waiting? && dummy_stages.declined.count >= 1
    dummy_stages.on_going.update_all(status: DummyStage.statuses[:canceled])
    self.declined!
    Envelope.setup_file_for(self, 'audit_trail')
  end

  def do_deleted
    self.deleted!
    self.sign_tasks.each(&:do_deleted)
  end

  def can_complete_now?
    return false unless has_try_to_complete?
    sign_tasks.each do |task|
      task_completed = Rails.cache.read("envelope:#{id}:task:#{task.id}:completed")
      return false unless task_completed
    end
    true
  end

  def has_try_to_complete?
    Rails.cache.read("envelope:#{id}:has_try_to_complete")
  end

  def can_start_now?
    return false unless draft? && start_from.present?
    return false unless original_file.present?
    return false unless xfdf_ready?
    return false unless references_ready? && completed_references_ready?
    true
  end

  def has_try_to_start?
    draft? && start_from.present?
  end

  def xfdf_ready?
    sign_tasks.all?(&:xfdf_ready?)
  end

  def references_ready?
    files_ready?(:reference)
  end

  def completed_references_ready?
    files_ready?(:completed_reference)
  end

  def files_ready?(file_type)
    setting = send("#{file_type}_setting")
    return true if setting.blank?

    uploaded_file_ids = send("#{file_type}_files").pluck(:label)
    required_file_ids = setting.pluck('reference_id')
    (required_file_ids - uploaded_file_ids).blank?
  end

  def need_cc?
    envelope_setting.cc_info.present?
  end

  def category_for_owner_after_start
    first_step_stage_sequence = dummy_stages.order(:sequence).first.sequence
    first_step_stage_emails = dummy_stages.where(sequence: first_step_stage_sequence).map(&:email)
    first_step_stage_emails.include?(owner.email) ? :waiting_for_me : :waiting_for_other
  end

  private

  def before_waiting
    if can_start_now?
      do_waiting
    elsif has_try_to_start?
      StartCheckWorker.perform_in(SignTask::START_CHECK_DURATION, id, 'Envelope')
    end
  end

  def setup_long_id
    self.long_id = loop do
      uuid = SecureRandom.uuid
      break uuid if Envelope.find_by_long_id(uuid).nil?
    end
  end

  def setup_modified_at
    self.modified_at ||= Time.zone.now
  end

  def mark_sign_event
    SignEvent.where(envelope_id: id).update_all(task_deleted: true) if deleted?
    SignEvent.where(envelope_id: id).update_all(task_expired: true) if expired?
  end

  def clear_cache
    case status
    when 'deleted'
      Rails.cache.delete_matched("envelope:#{id}:*")
    when 'completed'
      Rails.cache.delete("envelope:#{id}:has_try_to_complete")
      Rails.cache.delete_matched("envelope:#{id}:task:*:completed")
    end
  end

  def status_change_notify
    notify_member_ids = related_member_ids
    SocketCenter.broadcast_to_many(notify_member_ids, event: 'envelope_status_change', payload: { envelope_id: id })
    return if SignTask::NOTIFIABLE_STATUS.exclude?(status)
    notify_event = "envelope_#{status.chop}"
    SocketCenter.broadcast_to_many(notify_member_ids, event: notify_event, payload: { envelope_id: id })
    notify_member_ids.each do |member_id|
      NotificationCenter.delay.raise_if_server_failed('target_push', 'task_request', member_id, push_notify_info)
    end if create_and_invite?
  end

  def sign_task_position_changed?
    sign_tasks.any?(&:saved_change_to_position?)
  end

  def clear_first_task_cache
    @first_task = nil
  end

  def setup_needed_files
    Envelope.setup_file_for(self, 'completed')
    Envelope.setup_file_for(self, 'audit_trail')
    Envelope.setup_file_for(self, 'attachment') if stage_attachment_files.present?
    Envelope.setup_file_for(self, 'signature_compressed') if sign_tasks.any?(&:signature_compressed_file)
  end
end
