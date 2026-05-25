class DummyStage < Stage
  belongs_to :source, polymorphic: true
  belongs_to :actor, class_name: 'Member', optional: true

  has_one :xfdf_document, as: :stage, dependent: :destroy
  has_one :stage_setting, as: :stage, dependent: :destroy

  has_many :service_files, as: :storable, dependent: :destroy
  has_many :sign_events, as: :stage
  has_many :verify_methods, as: :stage, dependent: :destroy
  has_many :field_settings, as: :stage, dependent: :destroy
  has_many :field_setting_groups, -> { object_id_order }, as: :stage, dependent: :destroy
  has_many :attachments, -> { uploaded.where('label like ?', 'dummy_attachment_%') }, as: :storable, class_name: 'ServiceFile'

  enum status: ['initial', 'processing', 'done', 'declined', 'canceled', 'processing_file', 'processing_file_failed', 'signed', 'modifying', 'reviewed']

  before_validation :setup_actor, if: :email_changed_in_actor_info?
  after_commit :actions_after_processing_file_failed, if: :status_previously_changed?
  after_commit :assign_attachment_id, if: :attachment_setting_previously_changed?

  scope :display_order, -> { order(:sequence, :id) }
  scope :actor_visible, -> {
    joins("INNER JOIN envelopes ON dummy_stages.source_id = envelopes.id")
    .where.not(source_type: 'Envelope', envelopes: { status: [:draft, :deleted, :declined] })
  }
  scope :with_display_content, -> { includes(:xfdf_document, :actor, :field_settings) }
  scope :with_signers, -> { where(action: [:sign]) }

  class << self

    def setup_from_request(sign_type, task_id, stage_infos)
      DummyStage.where(source_type: 'SignTask', source_id: task_id).destroy_all
      stages = stage_infos.map.with_index do |stage_info, index|
        stage = new(source_type: 'SignTask', source_id: task_id, **stage_info.slice(*DummyStage.column_names))
        stage.sequence = index + 1
        stage.save!
        xfdf_info = stage_info[:xfdf_info] || []
        sign_info = stage_info[:sign_info] || []
        StageSetting.setup_from_request('DummyStage', stage.id, stage_info[:stage_setting]) if stage_info[:stage_setting].present?
        FieldSettingGroup.setup_from_request(stage.source_info, stage_info[:field_setting_groups])
        FieldSetting.setup_from_xfdf_info(stage.source_info, xfdf_info) if xfdf_info.present?
        Rails.cache.write("signtask:#{task_id}:dummystage:#{stage.id}:sign_info", sign_info) if sign_info.present?
        stage
      end
      stages
    end

    def setup_from_template(template_id, stage_infos, has_order: false)
      DummyStage.where(source_type: 'Template', source_id: template_id).destroy_all
      no_order_sequence = stage_infos.length
      viewable_attachment_id_map = {}
      last_base_stage_id = nil
      stages = stage_infos.map.with_index do |stage_info, index|
        xfdf_info = stage_info[:xfdf_info] || []
        attachment_setting = stage_info[:attachment_setting] || []

        stage = new(source_type: 'Template', source_id: template_id, **stage_info.slice(*DummyStage.column_names))
        stage.actor_info = stage_info.slice(:role)
        stage.actor_info['base_stage_id'] = last_base_stage_id if last_base_stage_id.present? && stage.action_review?
        stage.sequence = has_order ? (index + 1) : no_order_sequence
        stage.save!
        last_base_stage_id = stage.id if stage.action_sign?
        viewable_attachment_id_map = stage.format_stage_attachment_settings(attachment_setting, viewable_attachment_id_map)

        StageSetting.setup_from_request('DummyStage', stage.id, stage_info[:stage_setting], viewable_attachment_id_map: viewable_attachment_id_map) if stage_info[:stage_setting].present?
        VerifyMethod.setup_from_request(stage.class.base_class.name, stage.id, stage_info[:verify]) if stage_info[:verify].present?
        FieldSettingGroup.setup_from_request(stage.source_info, stage_info[:field_setting_groups])
        FieldSetting.setup_from_xfdf_info(stage.source_info, xfdf_info) if xfdf_info.present?
        stage
      end
      stages
    end

    def setup_from_envelope(envelope_id, stage_infos)
      DummyStage.where(source_type: 'Envelope', source_id: envelope_id).destroy_all
      stages = stage_infos.map.with_index do |stage_info, index|
        stage = new(source_type: 'Envelope', source_id: envelope_id, **stage_info.slice(*DummyStage.column_names))
        stage.sequence = index + 1
        stage.save!
        StageSetting.setup_from_request('DummyStage', stage.id, stage_info[:stage_setting]) if stage_info[:stage_setting].present?
        stage
      end
      stages
    end
  end

  def email
    actor_info['email'].presence || actor&.email
  end

  def actor_display_name
    name = actor_info['name']
    return name if name.present?

    name = actor_info['email'].present? ? actor_info['email'].split('@').first : actor_info['role']
    return name if name.present?

    actor&.display_name
  end

  def need_otp_verify?
    if source_type == 'Envelope'
      return false if source.sign_stages.blank?
      @sign_stage ||= StageFinder.find_by_sequence(source.sign_stages, sequence)
      @sign_stage&.need_otp_verify?
    else
      verify_methods.normal.present?
    end
  end

  def verify_methods
    if source_type == 'Envelope'
      return [] if source.sign_stages.blank?
      @sign_stage ||= StageFinder.find_by_sequence(source.sign_stages, sequence)
      @sign_stage&.verify_methods || []
    else
      super
    end
  end

  def trigger_next_stages
    next_sequence = source.dummy_stages.initial.where("sequence > ?", sequence).minimum(:sequence)
    return if next_sequence.nil?
    next_stages = source.dummy_stages.initial.where(sequence: next_sequence)
    next_stages.each(&:do_processing)
  end

  def trigger_completed_task
    return unless source_type == 'SignTask'
    return if DummyStage.where(source_type: source_type, source_id: source_id).on_going.present?

    sign_infos = Rails.cache.redis.keys("signtask:#{source_id}:dummystage:*:sign_info")
    source.before_completed if sign_infos.blank?
  end

  def trigger_completed_envelope
    return unless source_type == 'Envelope'
    return if DummyStage.where(source_type: source_type, source_id: source_id).on_going.present?

    Rails.cache.write("envelope:#{source_id}:has_try_to_complete", true)
    source.before_completed
  end

  def do_processing
    self.processing!
    return if source_type == 'SignTask' && source.kiosk?
    Notification::ProcessingMailWorker.perform_async(id, self.class.name)
  end

  def sign_task
    source_type == 'SignTask' ? source : nil
  end

  def sign_task_id
    source_id if source_type == 'SignTask'
  end

  def attachment_upload_infos
    upload_info = {}
    attachment_setting.map do |setting|
      upload_info[setting['file_name']] = upload_link_for(setting['attachment_id'])
    end
    upload_info
  end

  def allowed_to_forward?(member_id)
    return false if source_type != 'Envelope'
    return true if source.owner_id == member_id
    actor_id == member_id && stage_setting.present? && stage_setting.forward_enable
  end

  private

  def email_changed_in_actor_info?
    return false if source_type != 'Envelope'
    email_before_last_save = actor_info_before_last_save.present? ? actor_info_before_last_save['email'] : nil
    actor_info['email'] != email_before_last_save
  end

  def setup_actor
    self.actor_info['email'].strip!
    self.actor_info['email'].downcase!
    self.actor_id = Member.setup_member(actor_info['email']).id
  end

  def actions_after_processing_file_failed
    return unless processing_file_failed?
    return unless source_type == 'Envelope'

    self.source.add_sign_event(:ca_failed, actor.id, stage_info: self.basic_info, other_info: self.custom_cert_method&.display || {})

    doc_name = source.envelope_name
    code = source.original_file.preview_code(self, will_expired: true)
    deadline = source.envelope_setting&.deadline
    MailCenter.delay.raise_if_server_failed('signer_ca_fail_notify', actor.email, actor.display_name, doc_name, code, deadline)
  end

  def assign_attachment_id
    return attachment_setting if attachment_setting.blank?
    self.attachment_setting.each_with_index do |setting, index|
      setting['attachment_id'] = "dummy_attachment_#{id}_#{index + 1}"
      setting['force'] = ActiveModel::Type::Boolean.new.cast(setting['force'])
    end
    update_columns(attachment_setting: attachment_setting)
  end

end
