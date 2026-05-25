module Form
  class CreateFromTemplate < Create
    attr_reader :public_form

    def initialize(owner, template_id, form_info, setting_info = {})
      @owner = owner
      @template_id = template_id
      @form_info = form_info
      @setting_info = setting_info
    end

    def call
      setup_template
      check_form_info

      ActiveRecord::Base.transaction do
        duplicate_template_for_public_form
        create_public_form
      end

      @result = @public_form.display
    end

    private

    def setup_template
      @template = Template.find_by(id: @template_id)
      raise ServiceError.new(:template_not_found) if @template.nil?
      raise ServiceError.new(:template_not_found) unless @template.stages_xfdf_exist?
    end

    def duplicate_template_for_public_form
      duplicator = Factories::Template::Duplicate.call(@owner, @template, @form_info[:form_name], setting_info: @setting_info, duplicate_tags: true, usage: :public_form)
      raise ServiceError.new(duplicator.error.key, duplicator.error.message) if duplicator.failed?
      @form_template = duplicator.template
    end
  end
end
