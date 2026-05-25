class Template
  module GroupSearchable
    extend ActiveSupport::Concern

    class_methods do

      def related_ids(member)
        owned_template_ids = Template.where(owner_id: member.id).where('group_id is NULL or group_id = ?', member.group_id).pluck(:id)
        template_ids = owned_template_ids + shared_to(member).pluck(:id)
      end

      def related_to(member)
        ids = related_ids(member)
        Template.where(id: ids)
      end

      def shared_to(member)
        member_group_roles = Member.find_by_id(member.id).group_roles(member.group_id).pluck(:name)
        shared_templated = self.joins(:share_settings).where(share_settings: {target_type: 'Group', target_id: member.group_id})
      end

    end
  end
end
