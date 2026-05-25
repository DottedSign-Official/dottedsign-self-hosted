class SignTask
  module Searchable
    extend ActiveSupport::Concern

    include TaskRelated::Searchable

    class_methods do
      def search_related(target, terms)
        case target
        when 'recipient'
          search_by_recipient(terms)
        when 'document'
          search_by_document(terms)
        else
          search_by_field(target, terms)
        end
      end

      def related_with(member)
        where(id: related_ids(member))
      end

      def related_ids(member)
        owner_task_ids = active.where(owner_id: member.id).pluck(:id)
        signer_task_ids = SignStage.actor_visible.where(actor_id: member.id).pluck(:sign_task_id)
        related_task_ids = owner_task_ids + signer_task_ids
        related_task_ids.sort.uniq
      end

      def search_by_recipient(terms)
        matched_member_ids = Member.matched_ids(terms)
        owner_task_ids = self.where(owner_id: matched_member_ids).pluck(:id)
        signer_task_ids = self.joins(:sign_stages).where(sign_stages: {actor_id: matched_member_ids}).or(self.joins(:sign_stages).where('sign_stages.actor_name ILIKE ?', "%#{terms}%")).pluck(:id)
        owner_task_ids + signer_task_ids
      end

      def search_by_document(terms)
        self.where("file_name ILIKE ?", "%#{terms}%").pluck(:id)
      end

      def search_by_field(search_key, search_value)
        self.joins(:field_settings, :search_keys).where(search_keys: {name: search_key}, field_settings: {field_value: search_value}).pluck(:id)
      end

      def search_by_date_range(date_range)
        self.joins(:sign_events).where(sign_events: {created_at: date_range}).where.not(sign_events: {action_name: 'viewed'}).pluck(:id)
      end
    end

    def related_member_ids
      member_ids = [owner_id] + sign_stages.pluck(:actor_id)
      member_ids.compact.uniq
    end

    def related_emails
      emails = [owner.email] + sign_stages.pluck(:email)
      emails.compact.uniq
    end

    def related_to_group?(gid)
      false
    end

    def related_to_group_others?(member)
      false
    end

    def owned_by_group?(member)
      false
    end

    def acted_by_group?(member)
     false
    end

    def client_info_match?(client_info)
      client_info[:client] ||= 'unknow'
      client_info[:ip_address] ||= 'unknow'
      start_from['client'] == client_info[:client] && start_from['ip_address'] == client_info[:ip_address]
    end
  end
end
