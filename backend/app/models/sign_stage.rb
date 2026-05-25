class SignStage < Stage
  belongs_to :sign_task
  belongs_to :actor, class_name: 'Member', optional: true

  has_one :xfdf_document, as: :stage, dependent: :destroy
  has_one :stage_setting, as: :stage, dependent: :destroy
  has_one :decline_log, dependent: :destroy

  has_many :service_files, as: :storable, dependent: :destroy
  has_many :sign_events, as: :stage, dependent: :destroy
  has_many :change_events, -> { where(action_name: 'signer_changed') }, as: :stage, class_name: 'SignEvent'
  has_many :verify_methods, as: :stage, dependent: :destroy
  has_many :field_settings, as: :stage, dependent: :destroy
  has_many :field_setting_groups, as: :stage, dependent: :destroy

  enum status: ['initial', 'processing', 'done', 'declined', 'canceled', 'processing_file', 'processing_file_failed', 'signed', 'modifying', 'reviewed']

  before_validation :setup_actor, if: :email_changed?
  after_commit :setup_sequence, :actions_after_processing_file_failed, if: :status_previously_changed?

  scope :display_order, -> { order(:sequence, :id) }
  scope :actor_visible, -> { includes(:sign_task).where.not(sign_tasks: { status: [:draft, :deleted, :declined] }) }
  scope :with_display_content, -> { includes(:xfdf_document, :actor, :sign_task, :attachments, :field_settings) }
  scope :with_health_check_content, -> { includes(:stage_setting, :decline_log, :field_settings, change_events: [:sign_task]) }
  scope :with_signers, -> { where(action: [:sign, :form_sign]) }
  scope :with_form_signer, -> { where(action: :form_sign) }
  scope :specific_sequence_in_envelope, -> (envelope_id, sequence) { includes(:sign_task, :attachments).joins(sign_task: :envelope).where(sign_tasks: { envelope_id: envelope_id }, sequence: sequence) }

  alias :source :sign_task
  alias_attribute :source_id, :sign_task_id

  prepend ::Groupable

  class << self

    def setup_from_request(owner_id, task_id, stage_infos, has_order: true)
      SignStage.where(sign_task_id: task_id).destroy_all
      @envelope_stage = nil
      no_order_sequence = stage_infos.length
      viewable_attachment_id_map = {}
      last_base_stage_id = nil
      stages = stage_infos.map.with_index do |stage_info, index|
        xfdf_info = stage_info[:xfdf_info] || []
        attachment_setting = stage_info[:attachment_setting] || []
        contact_info = { email: stage_info[:email], name: stage_info[:name] }

        stage = new(sign_task_id: task_id, actor_name: stage_info[:name], **stage_info.slice(*SignStage.column_names))
        stage.sequence = has_order ? (index + 1) : no_order_sequence
        stage.group_id = Member.find_by(email: stage_info[:email])&.group_id
        stage.actor_info['base_stage_id'] = last_base_stage_id if last_base_stage_id.present? && stage.action_review?
        stage.save!
        last_base_stage_id = stage.id if stage.action_sign?
        viewable_attachment_id_map = stage.format_stage_attachment_settings(attachment_setting, viewable_attachment_id_map)

        VerifyMethod.setup_from_request(stage.class.base_class.name, stage.id, stage_info[:verify]) if stage_info[:verify].present?
        FieldSettingGroup.setup_from_request(stage.source_info, stage_info[:field_setting_groups])
        FieldSetting.setup_from_xfdf_info(stage.source_info, xfdf_info) if xfdf_info.present?
        Contact.setup_for_member(owner_id, contact_info)
        stage
      end

      # Finally, in the settings, because all the values of @viewable_attachment_id_map are needed
      stages.each_with_index do |stage, index|
        StageSetting.setup_from_request('SignStage', stage.id, stage_infos[index]&.dig(:stage_setting), viewable_attachment_id_map: viewable_attachment_id_map)
      end

      stages
    end
  end

  def source_type
    'SignTask'
  end

  def envelope_stage
    return unless source.in_envelope?
    @envelope_stage ||= source.envelope.dummy_stages.find_by(sequence: sequence)
  end

  def actor_display_name
    actor_info['name'].presence ||
      actor&.name.presence ||
      actor_name ||
      email.split('@').first
  end

  def trigger_next_stages
    initial_stages = sign_task.sign_stages.initial
    next_sequence = initial_stages.where("sequence > ?", sequence).minimum(:sequence)
    return if next_sequence.nil? && !action_form_sign?

    next_stages = initial_stages.where(sequence: next_sequence)
    if action_form_sign? && !next_stages.with_form_signer.exists?
      sign_task.increase_public_form_sent_num!
    end
    next_stages.each(&:do_processing)
  end

  def trigger_completed_task
    sign_task.before_completed if SignStage.where(sign_task_id: sign_task_id).on_going.blank?
  end

  def do_processing
    return if processing_from.present? && action_sign?
    self.processing_from = Time.zone.now
    self.processing!
    Notification::ProcessingMailWorker.perform_async(id) if informable?
    NotificationCenter.delay.raise_if_server_failed('target_push', 'task_request', actor_id, sign_task.push_notify_info)
  end

  def need_otp_verify?
    verify_methods.normal.present?
  end

  def allowed_to_forward?(member_id)
    return true if sign_task.owner_id == member_id
    actor_id == member_id && stage_setting.present? && stage_setting.forward_enable
  end

  def health_check_display
    {
      id: id,
      email: email,
      sequence: sequence,
      status: status,
      attachment_setting: attachment_setting,
      uploaded_attachment: attachments&.pluck(:label),
      stage_setting: stage_setting,
      forward_logs: change_events.map(&:detail_display),
      decline_log: decline_log&.health_check_display,
      field_types: field_settings_health_check_display
    }
  end

  def attachment_setting_with_thumbnail
    attachment_thumbnail_map = attachments.index_by(&:label).transform_values do |attachment|
      attachment.thumbnail.attached? ? attachment.download_link(attach_type: 'thumbnail') : nil
    end
    attachment_setting.map do |setting|
      setting[:thumbnail] = attachment_thumbnail_map[setting['attachment_id']]
      setting
    end
  end

  def informable?
    return false if sign_task.in_envelope?
    return false if action_form_sign?
    true
  end

  private

  def setup_actor
    self.email.strip!
    self.email.downcase!
    self.actor_id = Member.setup_member(email).id
    # for form signer digit cert use (in CaAuthenticator)
    Member.setup_member(actor_info['email']) if action_form_sign? && need_stage_cert?
  end

  def setup_sequence
    return if sign_task.has_order?
    return unless (signed? || done?) && ['processing', 'modifying'].include?(status_before_last_save)

    # stages: A, B (review), C (review), D, E (review), F (review)
    # 1. before D signed: sequences are all 6
    # 2. D signed: sequences are: D(1) -- E(3) -- F(3) -- A(6) -- B(6) -- C(6)
    # 3. F reviewed: sequences are: D(1) -> F(2) -- F(3) -- A(6) -- B(6) -- C(6)
    # 4. A signed: sequences are: D(1) -> F(2) -- F(3) -> A(4) -- B(6) -- C(6)
    if action_sign?
      last_sequence = sign_task.sign_stages.where('sequence < ?', sequence).maximum(:sequence)
      self.update(sequence: last_sequence.to_i + 1)
      review_stages = sign_task.sign_stages.action_review.initial.where("(actor_info ->> 'base_stage_id')::integer = ?", id)
      review_stages.update_all(sequence: last_sequence.to_i + 1 + review_stages.length) if review_stages.present?
    elsif action_review?
      self.update(sequence: sibling_review_stages.present? ? sibling_review_stages.maximum(:sequence) + 1 : base_stage.sequence + 1)
    end
  end

  def field_settings_health_check_display
    display = Hash.new { |hash, key| hash[key] = 0 }
    field_settings.each do |setting|
      hkey = setting.options['force'] ? "#{setting.field_type}*" : setting.field_type
      display[hkey] += 1
    end
    display.map do |(field_type, field_count)|
      {
        field_type: field_type,
        field_count: field_count
      }
    end
  end

  def actions_after_processing_file_failed
    return unless processing_file_failed?

    self.sign_task.add_sign_event(:ca_failed, actor_id, stage_info: self.basic_info, other_info: self.custom_cert_method&.display || {})
    return if sign_task.in_envelope?

    doc_name = sign_task.file_name
    code = sign_task.original_file.preview_code(self, will_expired: true)
    deadline = sign_task.task_setting&.deadline
    MailCenter.delay.raise_if_server_failed('signer_ca_fail_notify', actor.email, actor.display_name, doc_name, code, deadline)
  end
end
