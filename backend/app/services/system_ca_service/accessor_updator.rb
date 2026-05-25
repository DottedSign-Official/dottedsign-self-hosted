module SystemCaService
  class AccessorUpdator < ServiceCaller
    def initialize(system_ca, emails = [])
      @system_ca = system_ca
      @emails = emails
    end

    def call
      check_ca
      get_member_from_emails
      purge_ca_members
      assign_ca_to_member
      @system_ca.reload

      @result = @system_ca
    end

    private

    def check_ca
      raise ServiceError.new(:system_ca_not_found) if @system_ca.nil?
    end

    def get_member_from_emails
      @members = @emails.map do |email|
        Member.where(group_id: @system_ca.group_id).find_by(email: email)
      end.compact
    end

    def purge_ca_members
      @system_ca.members.clear
    end

    def assign_ca_to_member
      @members.each do |member|
        SystemCaAccessRight.create!(system_ca: @system_ca, accessor: member)
      end
      @members
    end

  end
end
