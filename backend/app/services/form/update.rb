module Form
  class Update < ServiceCaller
    include ::FormCheck

    attr_reader :public_form

    def initialize(owner, form_id, form_info, template_info, setting_info = {})
      @owner = owner
      @form_id = form_id
      @form_info = form_info
      @template_info = template_info
      @setting_info = setting_info
    end

    def call
      ActiveRecord::Base.transaction do
        setup_public_form
        update_form_template
        check_form_info
        update_public_form
      end

      @public_form.reload
      @result = @public_form.display
    end

    private

    def setup_public_form
      @public_form = PublicForm.find_by(id: @form_id)
      raise ServiceError.new(:form_not_found) unless @public_form
      raise ServiceError.new(:form_is_deleted) if @public_form.is_deleted?
      raise ServiceError.new(:form_not_owned) unless @public_form.owner_id == @owner.id
      raise ServiceError.new(:form_should_unpublish) unless @public_form.unpublish?
      raise ServiceError.new(:invalid_params, error_message: 'invalid goal_num') if @form_info[:goal_num] != -1 && @form_info[:goal_num] < @public_form.finish_num
    end

    def update_form_template
      @template = @public_form.template
      @template.update_from_request(@template_info, @setting_info)
      @owner.tag(@template, with: @template_info[:tags], on: :tags) if @template_info.key?(:tags)
    end

    def update_public_form
      @form_info[:end_at] = nil if @form_info[:end_at] == -1
      @form_info[:status] = PublicForm.statuses[:terminated] if @form_info[:goal_num] == @public_form.finish_num || @form_info[:end_at] == Time.current.change(sec: 0).to_i
      @public_form.update(@form_info)
    end
  end
end
