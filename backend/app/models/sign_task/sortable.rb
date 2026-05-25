class SignTask
  module Sortable
    extend ActiveSupport::Concern

    included do
      scope :display_order, -> { order(modified_at: :desc, id: :desc) }
      scope :draft_order, -> { order(modified_at: :desc, id: :desc) }
      scope :completed_order, -> { order(completed_at: :desc, id: :desc) }
      scope :waiting_order, -> { joins(:sign_events).where(sign_events: {action_name: ['sent', 'signed', 'signer_changed']}).group("sign_tasks.id").order(Arel.sql('max(sign_events.created_at) desc')) }
      scope :canceled_order, -> { joins(:sign_events).merge(SignEvent.canceled).group("sign_tasks.id").order(Arel.sql("max(sign_events.created_at) desc")) }
    end

    class_methods do

      def category_display_order(category)
        case category
        when /draft/
          'draft_order'
        when /completed/
          'completed_order'
        when /canceled/
          'canceled_order'
        else
          'waiting_order'
        end
      end

      def action_display_order(sort_type, order_by: :desc)
        order_by ||= :desc
        case sort_type
        when 'created_at', nil
          order(created_at: order_by)
        when 'modified_at'
          joins(:modified_action).group("sign_tasks.id").order("max(sign_events.created_at) #{order_by}")
        end
      end

      def group_task_ids_by_envelope(task_ids)
        with_envelope = SignTask.joins(:envelope).where.not(envelope_id: nil).where(id: task_ids)
          .where('sign_tasks.status = envelopes.status').select('DISTINCT ON (envelope_id) sign_tasks.*')
          .map(&:id)
        without_envelope = SignTask.where(id: task_ids, envelope_id: nil).pluck(:id)
        return with_envelope, without_envelope
      end

      def prepare_mixed_task_infos(paginated_tasks, independent_task_ids, member_id)
        sorted_task_ids = paginated_tasks.pluck(:id)
        paginated_task_ids = sorted_task_ids & independent_task_ids
        paginated_envelope_ids = paginated_tasks.pluck(:envelope_id).compact
        mixed_task_infos = SignTask.mix_and_sort_tasks(sorted_task_ids, paginated_task_ids, paginated_envelope_ids, member_id)
        return paginated_tasks, mixed_task_infos
      end

      def mix_and_sort_tasks(sorted_task_ids, paginated_task_ids, paginated_envelope_ids, member_id)
        sign_task_map = SignTask.where(id: paginated_task_ids).display_infos(member_id).group_by { |item| item[:task_id] }
        envelope_map = Envelope.where(id: paginated_envelope_ids).display_infos(member_id).group_by { |item| item[:envelope_id] }
        sorted_task_ids.flat_map do |task_id|
          paginated_task_ids.include?(task_id) ? sign_task_map[task_id] : envelope_map[paginated_envelope_ids.shift]
        end
      end

    end
  end
end
