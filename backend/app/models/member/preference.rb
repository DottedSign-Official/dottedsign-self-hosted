class Member
  module Preference
    extend ActiveSupport::Concern

    included do
      after_commit :send_signatures_to_numbers, on: :update, if: :preferences_previously_changed?
    end

    def preference_info
      Settings.default.preference.merge(preferences)
    end

    Settings.default.preference.keys.each do |preference_key|
      define_method preference_key do
        preferences.key?(preference_key) ? preferences[preference_key] : Settings.default.preference[preference_key]
      end
    end

    def receive_otp_always
      otp_via_email || otp_via_phone
    end

    def update_preference(preference)
      self.assign_attributes(preference.except(:preferences))
      self.preferences.merge!(preference[:preferences])
      self.save
    end

    private

    def send_signatures_to_numbers
      return unless preferences['link_to_numbers']
      signatures.signature_category.not_on_numbers.each do |signature|
        SignatureToNubmersWorker.perform_async(signature.id)
      end
    end

  end
end
