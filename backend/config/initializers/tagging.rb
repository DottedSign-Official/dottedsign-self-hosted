ActsAsTaggableOn.strict_case_match = true

Rails.application.reloader.to_prepare do
  ActsAsTaggableOn::Tagging.include(Extensions::TagLinkList)
end
