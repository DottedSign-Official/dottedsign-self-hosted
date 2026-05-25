class Setting < ApplicationRecord
  self.abstract_class = true

  before_save :setup_cc_members, if: :cc_info_changed?
  after_commit :process_reference_setting, on: :update, if: :reference_setting_previously_changed?
  after_commit :process_completed_reference_setting, on: :update, if: :completed_reference_setting_previously_changed?
  after_commit :otp_verify_setting, on: :update, if: :need_to_set_otp?

  attr_writer :update_setting_only

  class << self

    def setup_from_request(owner_id, source_id, setting_attrs)
      source_setting = setup_from_source_id(source_id)
      source_setting.assign_attributes(setting_attrs)
      return unless source_setting.save
      source_setting.cc_info&.each do |cc_info|
        Contact.setup_for_member(owner_id, cc_info)
      end
    end

  end

  def display_info(member_id: nil)
    info = as_json(only: [:forget_remind, :cc_info, :need_otp_verify, :receiver_lang, :need_ca], methods: [:expire_remind, :remind_days_before_expire, :expires_in_days])
    info[:message] = source.can_view_processing_message?(member_id: member_id) ? message : nil
    info[:reference_setting] = source.can_view_processing_message?(member_id: member_id) ? reference_setting : []
    info[:completed_message] = source.can_view_completed_message?(member_id: member_id) ? completed_message : nil
    info[:completed_reference_setting] = source.can_view_completed_message?(member_id: member_id) ? completed_reference_setting : []
    info[:deadline] = display_deadline
    info
  end

  def expire_remind
    expire_remind_at.present?
  end

  def display_deadline
    deadline&.to_i
  end

  def remind_days_before_expire
    return if deadline.nil?
    return 0 if expire_remind_at.nil?
    before_seconds = deadline - expire_remind_at
    before_seconds / ActiveSupport::Duration::SECONDS_PER_DAY
  end

  def expires_in_days
    return if deadline.nil?
    expire_time = deadline.to_i
    current_time = Time.zone.now.to_i
    return -1 if expire_time <= current_time
    diff_seconds = expire_time - current_time
    expires_in_days = diff_seconds / ActiveSupport::Duration::SECONDS_PER_DAY
    expires_in_days += 1 unless diff_seconds % ActiveSupport::Duration::SECONDS_PER_DAY == 0
    expires_in_days
  end

  def cc_emails
    cc_info.pluck('email')
  end

  private

  def setup_cc_members
    cc_info.each do |info|
      email = info['email'].strip.downcase
      Member.setup_member(email)
      info['email'] = email
    end
  end

  def deadline_changed
    source.waiting! if source.status == 'expired' && (deadline.nil? || deadline.to_i > Time.now.to_i)
    return if deadline.nil?
    return if source.is_a?(SignTask) && source.in_envelope?
    Notification::TaskSettingChangeMailWorker.perform_async(source_id, source.class.name, 'deadline', deadline.to_i)
  end

  def process_reference_setting
    process_reference_setting_changes(:reference_setting)
  end

  def process_completed_reference_setting
    process_reference_setting_changes(:completed_reference_setting)
  end

  def process_reference_setting_changes(setting_field)
    # Rails attribute tracking sugar: e.g. reference_setting_previous_change → [old_value, new_value]
    # Example return: [[{ 'reference_id' => 'A1' }], [{ 'reference_id' => 'A2' }]]
    old_setting, new_setting = send("#{setting_field}_previous_change")
    delete_references = old_setting - new_setting
    ServiceFile.where(storable_type: source_type, storable_id: source_id, label: delete_references.pluck('reference_id'))&.destroy_all
  end

  def need_to_set_otp?
    @update_setting_only && need_otp_verify_previously_changed?
  end

  def otp_verify_setting
    sign_tasks = source.is_a?(Envelope) ? source.sign_tasks : [source]
    if need_otp_verify
      sign_tasks.each do |task|
        task.sign_stages.on_going.each do |stage|
          VerifyMethod.setup_from_request(stage.class.base_class.name, stage.id, [{ 'verify_type' => 'signer_detect' }])
        end
      end
    else
      sign_tasks.each do |task|
        task.sign_stages.on_going.each do |sign_stage|
          sign_stage.verify_methods.destroy_all
        end
      end
    end
  end
end
