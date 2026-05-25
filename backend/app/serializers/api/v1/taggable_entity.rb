class Api::V1::TaggableEntity < BaseEntity

  expose :taggable_id do |taggable|
    taggable.id
  end

  expose :taggable_type do |taggable|
    taggable.class.name
  end

  expose :tag_info do |taggable, options|
    taggable.tag_info_for(options[:tagger].id)
  end
end
