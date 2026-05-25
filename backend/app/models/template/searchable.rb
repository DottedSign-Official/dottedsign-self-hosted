class Template
  module Searchable
    extend ActiveSupport::Concern

    class_methods do

      def related_ids(member)
        Template.where(owner_id: member.id, group_id: member.group_id).pluck(:id)
      end

      def related_to(member)
        ids = related_ids(member)
        Template.where(id: ids)
      end

      def shared_to(member)
        Template.none
      end

    end
  end
end
