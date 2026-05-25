module CustomTaggable
  extend ActiveSupport::Concern

  module ClassMethods
    def tagged_with_case_sensitive(tags, owned_by: nil, on: :tags)
      joins(taggings: :tag).where(taggings: {tagger: owned_by, context: on}, tags: {name: tags})
    end
  end

  # show a tag hash with owned tags as key and tagged or not as value
  def tag_info_for(member_id)
    ActsAsTaggableOn::Tagging.tag_info_for(member_id, self)
  end

  # show a tag array that tagger tagged on the object
  def assigned_tags_by(tagger)
    # do not use owner_tags_on to avoid n+1 for list API
    self.taggings.select do |tagging|
      tagging.tagger == tagger
    end.map(&:tag).pluck(:name)
  end

  def update_tags_by(tagger, add_tags: [], remove_tags: [])
    tag_names = self.assigned_tags_by(tagger)
    tag_names = tag_names + add_tags - remove_tags
    tagger.tag(self, with: tag_names, on: :tags)
  end

end
