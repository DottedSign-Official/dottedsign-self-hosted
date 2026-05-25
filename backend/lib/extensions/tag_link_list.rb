module Extensions
  module TagLinkList
    extend ActiveSupport::Concern

    included do
      before_create :add_to_list_tail
      before_destroy :remove_from_list

      belongs_to :prev_tagging, class_name: '::ActsAsTaggableOn::Tagging', foreign_key: 'prev_id', optional: true
      has_one :next_tagging, class_name: '::ActsAsTaggableOn::Tagging', foreign_key: 'prev_id'
    end

    class_methods do

      def list_with_sequence(args, &block)
        same_list_tagging = ActsAsTaggableOn::Tagging.where(args)
        prev_tagging_map = same_list_tagging.includes(:tag).to_h{|tagging| [tagging.prev_id, tagging]}
        tagging_list = []
        same_list_tagging.count.times do |num|
          tagging_list << (num == 0 ? prev_tagging_map[nil] : prev_tagging_map[tagging_list[num - 1].id])
          yield tagging_list[num], tagging_list[num].tag
        end
        tagging_list
      end

      def first_tagging_of_list(args)
        ActsAsTaggableOn::Tagging.where(args).find_by(prev_id: nil)
      end

      def tag_list_for_member(member_id, context='tags')
        tag_list = {}
        list_with_sequence(taggable_type: 'Member', taggable_id: member_id, context: context) do |tagging, tag|
          tag_list[tag.name] = false
        end
        tag_list
      end

      def tag_list_for_target(member_id, target, context='tags')
        tag_list = {}
        list_with_sequence(tagger_type: 'Member', tagger_id: member_id, taggable_type: target.class.name, taggable_id: target.id, context: context) do |tagging, tag|
          tag_list[tag.name] = true
        end
        tag_list
      end

      # target will be task, envelope or template
      def tag_info_for(member_id, target, context='tags')
        all_tag_hash = tag_list_for_member(member_id, context)
        target_tag_hash = tag_list_for_target(member_id, target, context)
        all_tag_hash.merge(target_tag_hash)
      end

    end

    def in_same_list
      ActsAsTaggableOn::Tagging.where(taggable_type: taggable_type, taggable_id: taggable_id, tagger_type: tagger_type, tagger_id: tagger_id, context: context)
    end

    def move_behind(tag_name)
      return true if prev_tagging&.tag&.name == tag_name
      next_tagging&.update(prev_id: prev_id)
      self.reload
      if tag_name.nil?
        in_same_list.find_by(prev_id: nil)&.update(prev_id: id)
        update(prev_id: nil)
      else
        target_tagging = in_same_list.joins(:tag).find_by(tags: {name: tag_name})
        return false if target_tagging.nil?
        target_tagging.next_tagging&.update(prev_id: id)
        update(prev_id: target_tagging.id)
      end
    end

    private

    def add_to_list_tail
      old_taggings = in_same_list
      old_taggings_ids = [nil] + old_taggings.pluck(:id)
      old_taggings_prev_ids = old_taggings.pluck(:prev_id)
      self.prev_id = (old_taggings_ids - old_taggings_prev_ids).first
    end

    def remove_from_list
      return if next_tagging.nil?
      next_tagging.update(prev_id: prev_id)
    end
  end
end