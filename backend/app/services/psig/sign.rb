module Psig
  class Sign < ServiceCaller
    include CommandExecute

    attr_reader :working_dir

    PSIG_SETTING = Settings.digital_signature.psig
    REQUIRED_PARAMS = [
      :input_file,
    ].freeze
    SIGN_CMD = "#{PSIG_SETTING.path} \
      sign \
      --reason \"%<reason>s\" \
      --location \"%<location>s\" \
      --input-file \"%<input_file>s\" \
      --output-file %<output_file>s \
      --level %<level>s \
      --timestamp-location %<timestamp_location>s \
      --tsp-provider \"%<tsp_provider>s\" \
      --digest-algorithm %<digest_algorithm>s \
      --encryption-algorithm %<encryption_algorithm>s \
      --timestamp-digest-algorithm %<timestamp_digest_algorithm>s \
      --key-store-file \"%<key_store_file>s\" \
      --key-store-password %<key_store_password>s \
      %<visible_signature_opt>s \
      %<permission_opt>s".freeze

    def initialize(params)
      @params = params
      @input_file = params[:input_file]
      @working_dir = File.dirname(@input_file)
      FileUtils.mkdir_p(@working_dir)
    end

    def call
      validate_params
      sign
      @result = @output_file
    end

    private

    def validate_params
      raise ServiceError.new(:invalid_params, error_message: @params.to_json) if (REQUIRED_PARAMS - @params.keys.map(&:to_sym)).present?
    end

    def sign
      sign_cmd = (SIGN_CMD % sub_elements).gsub(/\s+/, ' ')
      sign_response = execute_system_cmd(sign_cmd)
      raise ServiceError.new(:command_execute_failed, error_message: "run '#{sign_cmd}' failed: #{sign_response}") if command_failed?(sign_response, failed_regex: /stderr/)
    end

    def sub_elements
      @output_file = File.join(@working_dir, 'output.pdf')
      reason_formatter = @params[:reason] || (@params[:cert_type] == 'ap_cert' ? PSIG_SETTING.reason_for_completed : PSIG_SETTING.reason_for_signed).presence || PSIG_SETTING.reason
      sub_elements = {
        reason: reason_formatter % @params,
        location: @params[:location] || (PSIG_SETTING.location % @params),
        input_file: @input_file,
        output_file: @output_file,
        level: @params[:level] || PSIG_SETTING.level,
        tsp_provider: @params[:tsp_provider] || PSIG_SETTING.tsp_provider,
        timestamp_location: @params[:timestamp_location] || PSIG_SETTING.timestamp_location,
        digest_algorithm: @params[:digest_algorithm] || PSIG_SETTING.digest_algorithm,
        encryption_algorithm: @params[:encryption_algorithm] || PSIG_SETTING.encryption_algorithm,
        timestamp_digest_algorithm: @params[:timestamp_digest_algorithm] || PSIG_SETTING.timestamp_digest_algorithm,
        key_store_file: @params[:key_store_file] || PSIG_SETTING.key_store_file,
        key_store_password: @params[:key_store_password] || PSIG_SETTING.key_store_password,
        visible_signature_opt: visible_signature_opt,
        permission_opt: permission_opt,
      }
      sub_elements
    end

    def visible_signature_opt
      return '' if @params[:visible_signature_image_file].blank?
      "--visible-signature-image-file #{@params[:visible_signature_image_file]} \
        --visible-signature-page #{@params[:visible_signature_page]} \
        --visible-signature-rect #{@params[:visible_signature_rect]}"
    end

    def permission_opt
      permission = @params[:permission] || PSIG_SETTING.permission
      return '' if permission.blank?
      "--permission #{permission}"
    end
  end
end