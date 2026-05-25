module Dummy
  class Verify < Normal::Verify
    attr_reader :action_mode, :task, :stage

    ALLOW_CLIENTS = ['app', 'web'].freeze

    def initialize(task_id, member, sign_info, client_info)
      @task_id = task_id
      @member = member
      @sign_info = sign_info
      @client_info = client_info
      @attachment_info = sign_info[:attachment_info] || {}
    end

    def call
      check_task
      check_stage
      detect_action_mode
      executable_check
    end

    private

    def check_task
      @task = SignTask.find_by_id(@task_id)
      raise ServiceError.new(:task_not_found) if @task.nil?
      raise ServiceError.new(:task_deleted) if @task.deleted?
      raise ServiceError.new(:task_not_signable) unless @task.signable?

      @member ||= @task.owner
    end

    def check_stage
      @stage = @task.dummy_stages.find_by_id(@sign_info[:dummy_stage_id])
      raise ServiceError.new(:stage_not_found) if @stage.nil?
    end

    def detect_action_mode
      @action_mode = @task.sign_and_send? ? :self : :guest
    end

    def field_setting_check
      signature_info = {}
      @sign_info[:signature_info].each do |info|
        signature_info[info[:object_id]] = info
      end
      @stage.field_settings&.each do |field_setting|
        next if field_setting.match_content?(signature_info[field_setting.field_object_id], valid_signatures: @member_signatures, skip_date_check: true)
        raise ServiceError.new(:field_content_invalid)
      end
    end

    def attachment_check
      raise ServiceError.new(:attachment_not_ready) if @attachment_info.any?{ |info| info[:uploaded] == false }
      attachment_ids = @attachment_info.pluck(:attachment_id)
      return if @stage.attachment_ready?(attachment_ids)
      allow_attachment_ids = @stage.attachment_setting.pluck('attachment_id')
      raise ServiceError.new(:attachment_setting_not_found) if attachment_ids.present? && (attachment_ids - allow_attachment_ids).present?
      raise ServiceError.new(:attachment_not_ready)
    end

  end
end
