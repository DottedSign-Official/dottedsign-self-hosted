module Contacts
  class Destroy < ServiceCaller
    def initialize(member:, email:)
      @member = member
      @email = email.to_s.strip.downcase
    end

    def call
      setup_contact
      destroy_contact
      @result = true
    end

    private

    def setup_contact
      @contact = @member.contacts.find_by(email: @email)
      raise ServiceError.new(:contact_not_exist) if @contact.nil?
    end

    def destroy_contact
      @contact.destroy!
    end
  end
end
