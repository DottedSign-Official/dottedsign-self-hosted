class SmsCenter::Mitake < SmsCenter::Base

  class << self

    def deliver(phone_number, otp_code, lang=:en)
      setup_locale(lang)
      params = {
        username: Settings.sms.user_name,
        password: Settings.sms.password,
        dstaddr: convert_phone_number(phone_number),
        smbody: "#{I18n.t("sign_mailer.signer_verify.default.subject")}: #{otp_code}",
      }

      requester.form_send(:post, sms_path, params)
    end
  end

end
