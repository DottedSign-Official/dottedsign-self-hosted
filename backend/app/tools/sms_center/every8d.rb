class SmsCenter::Every8d < SmsCenter::Base

  class << self

    def deliver(phone_number, otp_code, lang = :en)
      setup_locale(lang)
      params = {
        UID: Settings.sms.user_name,
        PWD: Settings.sms.password,
        SB: "#{I18n.t("sign_mailer.signer_verify.default.title")}",
        MSG: "#{I18n.t("sign_mailer.signer_verify.default.subject")}: #{otp_code}",
        DEST: phone_number
      }

      requester.form_send(:post, sms_path, params)
    end
  end

end
