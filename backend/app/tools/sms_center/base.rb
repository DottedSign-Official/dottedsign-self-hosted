class SmsCenter::Base < Base

  class << self

    def deliver; end

    private

    def requester
      JsonRequester.new(Settings.sms.host)
    end

    def sms_path
      Settings.sms.path
    end

    def setup_locale(lang)
      I18n.locale = LangHandle.mail_lang_mapping(lang)
    end

    def convert_phone_number(phone_number)
      if phone_number.include?("+886") && phone_number.include?("-")   # "+886-912345678" -> "0912345678"
        phone_number = "0" + phone_number.split('-').last
      elsif phone_number.include?("+886")  # "+886912345678" -> "0912345678"
        phone_number = "0" +  phone_number.gsub("+886", "")
      end

      phone_number
    end
  end

end
