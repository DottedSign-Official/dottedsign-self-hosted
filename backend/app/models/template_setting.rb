class TemplateSetting < Setting
  belongs_to :template

  alias :source :template
  alias_attribute :source_id, :template_id

  class << self

    def setup_from_source_id(template_id)
      find_or_initialize_by(template_id: template_id)
    end

  end

  def source_type
    'Template'
  end
end
