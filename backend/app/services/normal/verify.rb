module Normal
  class Verify < ServiceCaller
    attr_reader :action_mode, :task, :stage, :member

    ALLOW_CLIENTS = ['app', 'web'].freeze

    def initialize(task_id, member, sign_info, client_info)
      @task_id = task_id
      @member = member
      @sign_info = sign_info
      @verify_info = sign_info[:verify_info] || {}
      @code_info = sign_info.slice(:code)
      @client_info = client_info
      @attachment_info = sign_info[:attachment_info] || {}
    end

    def call
      check_client
      check_task
      check_stage
      detect_action_mode
      executable_check
      verify_now
      save_verify_events
    end

    private

    def check_client
      raise ServiceError.new(:sign_invalid_client) if ALLOW_CLIENTS.exclude?(@client_info[:client])
    end

    def check_task(check_action: 'sign_the_task')
      checker = TaskChecker.call(@task_id, @member, check_action: check_action)
      raise checker.error if checker.failed?
      @task = checker.result
      raise ServiceError.new(:task_not_signable) unless @task.signable?
      @actor = @member
    end

    def check_stage
      @stage = @task.sign_stages.acting.order(:sequence).find_by(actor_id: @actor.id)
      raise ServiceError.new(:not_signer_turn) if @stage.nil?
    end

    def detect_action_mode
      @action_mode = @actor.is_registered ? :normal : :quick
    end

    def executable_check
      obtain_member_valid_signatures
      field_setting_check
      field_setting_group_check
      attachment_check
    rescue => error
      raise processed_executable_error(error)
    end

    def obtain_member_valid_signatures
      @member_signatures = Signature.where(member_id: @member.id)
    end

    def field_setting_check
      return if @client_info[:client] == 'app'
      signature_info = {}
      @sign_info[:signature_info].each do |info|
        signature_info[info[:object_id]] = info
      end
      @stage.field_settings&.each do |field_setting|
        next if field_setting.match_content?(signature_info[field_setting.field_object_id], valid_signatures: @member_signatures)
        raise ServiceError.new(:field_content_invalid, field_setting_id: field_setting.id, sign_info: signature_info[field_setting.field_object_id], valid_signatures: @member_signatures)
      end
    end

    def field_setting_group_check
      return unless @sign_info[:signature_info].is_a?(Array)
      field_setting_info_batch = {}
      @stage.field_settings.where.not(field_setting_group_id: nil).includes(:field_setting_group)&.each do |field_setting|
        sign_info = @sign_info[:signature_info].find { |info| info[:object_id] == field_setting.field_object_id }
        next if sign_info.nil?
        field_setting_info_batch[field_setting.field_setting_group.field_group_object_id] ||= []
        field_setting_info_batch[field_setting.field_setting_group.field_group_object_id] << sign_info
      end

      @stage.field_setting_groups&.each do |field_setting_group|
        field_sign_infos_in_group = field_setting_info_batch[field_setting_group.field_group_object_id] || []
        is_match = field_setting_group.match_content?(field_sign_infos_in_group)
        next if is_match
        raise ServiceError.new(:field_content_invalid, error_obj: field_sign_infos_in_group)
      end
    end

    def attachment_check
      raise ServiceError.new(:attachment_not_ready, attachment_upload_data) if @attachment_info.any? { |info| info[:uploaded] == false }
      attachment_ids = @attachment_info.pluck(:attachment_id)
      return if @stage.attachment_ready?(attachment_ids, delete_redundancy: true)
      allow_attachment_ids = @stage.attachment_setting.pluck('attachment_id')
      raise ServiceError.new(:attachment_setting_not_found) if attachment_ids.present? && (attachment_ids - allow_attachment_ids).present?
      raise ServiceError.new(:attachment_not_ready, attachment_upload_data)
    end

    def attachment_upload_data
      upload_data = {}
      @attachment_info.each do |info|
        upload_data[info[:attachment_id]] = @stage.upload_link_for(info[:attachment_id])
      end
      { attachment_upload_info: upload_data }
    end

    def processed_executable_error(error)
      error.error_obj.merge!(@verify_tokens) if @verify_tokens.present?
      error
    end

    def verify_now
      prepare_for_verify
      verify = StageVerify.call(@stage, @verify_info, @client_info)
      if verify.failed?
        preprocess_verify_failed_error(verify.error)
        raise verify.error
      end
      @verify_event_infos = verify.result[:verify_event_infos]
      @verify_tokens = verify.result.except(:verify_event_infos)
    end

    def prepare_for_verify
      @verify_action = 'verified'
      @verify_member_id = @actor.id
    end

    def preprocess_verify_failed_error(verify_error)
      return unless verify_error.key == :stage_need_verify
      verify_error.error_obj[:signer_email] = @stage.email
      verify_error.error_obj[:verify_info].each do |info|
        case info[:state]
        when :waiting_for_auth
          update_ca_cache_data("ca_request:#{info[:tid]}")
        when :waiting_for_apply
          update_ca_cache_data("ca_apply:#{info[:discount_code]}")
        end
      end
    end

    def update_ca_cache_data(cache_key)
      cache_data = Rails.cache.read(cache_key)
      return if cache_data.blank?
      cache_data[:code] = @code_info[:code]
      cache_data[:member_id] = @member.id
      Rails.cache.write(cache_key, cache_data)
    end

    def save_verify_events
      return if @verify_event_infos.blank?
      @verify_event_infos.each do |event_info|
        other_info = event_info[:other_info]
        @task.add_sign_event(@verify_action, @verify_member_id, stage_info: @stage.event_info, client_info: @client_info, other_info: other_info)
      end
      Rails.cache.delete("#{@stage.class.base_class.name}:#{@stage.id}:verify_source")
    end
  end
end
