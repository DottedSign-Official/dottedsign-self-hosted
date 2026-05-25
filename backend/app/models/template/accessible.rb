class Template
  module Accessible
    extend ActiveSupport::Concern

    def accessibility_of(member, check_action = 'view', check_usage: true)
      @check_usage = check_usage
      send(check_action, member)
    end

    def owned_by_member?(member)
      owner_id == member.id
    end

    private

    def view(member)
      return :not_accessible if @check_usage && public_form?
      return :accessible if owned_by_member?(member)
      return :accessible if ShareSetting.find_by(shared_type: "Template", shared_id: id, target_type: "Group", target_id: member.group_id).present?
      :not_accessible
    end

    def duplicate(member)
      owned_by_member?(member) ? :accessible : :not_accessible
    end
  end
end
