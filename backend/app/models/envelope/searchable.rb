class Envelope
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
        when 'envelope'
          search_by_envelope(terms)
        end
      end

      def related_ids(member)
        owner_envelope_ids = active.where(owner_id: member.id).pluck(:id)
        signer_envelope_ids = DummyStage.actor_visible.where(actor_id: member.id).pluck(:source_id)
        related_envelope_ids = owner_envelope_ids + signer_envelope_ids
        related_envelope_ids.sort.uniq
      end

      def search_by_recipient(terms)
        matched_member_ids = Member.matched_ids(terms)
        owner_envelope_ids = self.where(owner_id: matched_member_ids).pluck(:id)
        signer_envelope_ids = self.joins(:dummy_stages).where(dummy_stages: {actor_id: matched_member_ids})
                                  .or(self.joins(:dummy_stages).where("dummy_stages.actor_info ->> 'name' ILIKE ?", "%#{terms}%"))
                                  .pluck(:id)
        related_envelope_ids = owner_envelope_ids + signer_envelope_ids
        related_envelope_ids.sort.uniq
      end

      def search_by_document(terms)
        SignTask.includes(:envelope).where("file_name ILIKE ?", "%#{terms}%").pluck(:envelope_id).uniq
      end

      def search_by_envelope(terms)
        self.where("envelope_name ILIKE ?", "%#{terms}%").pluck(:id)
      end

      def search_by_date_range(date_range)
        self.joins(:sign_events)
            .where(sign_events: { created_at: date_range })
            .where.not(sign_events: { action_name: 'viewed' })
            .pluck(:id)
      end
    end

    def related_member_ids
      member_ids = [owner_id] + dummy_stages.pluck(:actor_id)
      member_ids.compact.uniq
    end
  end
end
