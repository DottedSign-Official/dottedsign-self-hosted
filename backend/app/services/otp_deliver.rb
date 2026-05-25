class OtpDeliver < ServiceCaller
  attr_reader :failed_deliver

  DO_NOT_CACHE = false

  def initialize(stage_class, stage_id, uuid, verify_infos, otp_secret_key=nil, need_cache=true)
    @stage_class = stage_class
    @stage_id = stage_id
    @uuid = uuid
    @verify_infos = verify_infos
    @otp_secret_key = otp_secret_key || ROTP::Base32.encode("#{uuid}_#{Time.zone.now.to_i}")
    @need_cache = need_cache
  end

  def call
    check_stage!
    check_verify_infos!
    obtain_signer_receive_lang
    generate_otp
    cache_otp if @need_cache
    deliver_otp!
    @result = @success_deliver
  end

  private

  def check_stage!
    stage_class = @stage_class.safe_constantize
    raise ServiceError.new(:stage_not_found) if stage_class.nil?
    @stage = stage_class.find_by_id(@stage_id)
    raise ServiceError.new(:stage_not_found) if @stage.nil?
  end

  def check_verify_infos!
    @verify_infos.each do |verify_info|
      next if verify_info[:verify_source].present?
      verify_info[:default_source] = @stage.actor&.send(verify_info[:verify_type])
      verify_info[:default_source_detail] = @stage.actor&.verify_source(verify_info[:verify_type])
      raise ServiceError.new(:verify_source_not_set, verify_info: verify_info)
    end
  end

  def obtain_signer_receive_lang
    task = @stage.sign_task
    @lang = task.mail_lang_for(@stage.actor, @stage)
  end

  def generate_otp
    totp = ROTP::TOTP.new(@otp_secret_key)
    @current_otp = totp.now
  end

  def cache_otp
    cache_value = {
      trigger_at: Time.zone.now.to_i,
      current_otp: @current_otp
    }
    Rails.cache.write("signer_verify:#{@uuid}", cache_value, expires_in: VerifyMethod::OTP_INTERVAL)
  end

  def deliver_otp!
    @success_deliver = []
    @failed_deliver = []
    cache_sources = {}
    @verify_infos.each do |verify_info|
      verify_info[:uuid] = @uuid
      begin
        send("deliver_via_#{verify_info[:verify_type]}!", verify_info[:verify_source])
        @success_deliver << verify_info
        cache_sources[VerifyMethod::VERIFY_TYPE_DISPLAY_MAP[verify_info[:verify_type]]] = verify_info[:verify_source]
      rescue => e
        verify_info[:error_msg] = e.message
        @failed_deliver << verify_info
      end
    end
    if @success_deliver.present?
      Rails.cache.write("#{@stage_class}:#{@stage_id}:verify_source", cache_sources, expires_in: VerifyMethod::OTP_INTERVAL)
    else
      raise ServiceError.new(:deliver_otp_failed)
    end
  end

  def deliver_via_email!(email)
    deliver_info = @stage.sign_task.in_envelope? ? @stage.sign_task.envelope.deliver_info : @stage.sign_task.deliver_info
    deliver_info.merge!(user_name: @stage.actor_display_name || @stage.email, otp_code: @current_otp)
    deliver_res = MailCenter.signer_verify(email, deliver_info, @lang)
    raise deliver_res['message'] unless deliver_res['status'] == 200
  end

  def deliver_via_sms!(phone_number)
    sms_center = "SmsCenter::#{Settings.sms.service_name.to_s.camelize}".safe_constantize
    raise ServiceError.new(:sms_center_not_found) if sms_center.nil?

    deliver_res = sms_center.deliver(phone_number, @current_otp, @lang)
    raise deliver_res unless deliver_res['status'] == 200
  end

end
