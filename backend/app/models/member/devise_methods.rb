class Member
  ## Override Devise Methods
  #
  module DeviseMethods
    extend ActiveSupport::Concern

    class_methods do
      def find_for_authentication(conditions = {})
        find_first_by_auth_conditions(conditions, is_registered: true)
      end
    end

    def send_confirmation_instructions
      return if confirmed? && unconfirmed_email.nil?
      generate_confirmation_token! unless @raw_confirmation_token
      receiver = pending_reconfirmation? ? unconfirmed_email : email
      MailCenter.delay.raise_if_server_failed('confirmation_instruction', receiver, display_name, @raw_confirmation_token, profile.language)
    end

    def send_reset_password_instructions
      token = set_reset_password_token
      MailCenter.delay.raise_if_server_failed('forget_password', email, token, profile.language)
    end
  end
end
