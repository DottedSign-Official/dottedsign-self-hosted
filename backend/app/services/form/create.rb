module Form
  class Create < ServiceCaller
    include ::FormCheck

    attr_reader :public_form

    def initialize(owner, form_info, template_info, setting_info = {})
      @owner = owner
      @form_info = form_info
      @template_info = template_info
      @setting_info = setting_info
    end

    def call
      ActiveRecord::Base.transaction do
        create_template
        check_form_info
        setup_form_signer_info
        create_public_form
      end

      @result = @public_form.display
    end

    private

    def create_template
      # @template for check_form_info in FormCheck
      @template = @form_template = Template.create_from_request(@owner.id, @template_info, @setting_info)
      @owner.tag(@form_template, with: @template_info[:tags], on: :tags) if @template_info[:tags].present?
    end

    def setup_form_signer_info
      template_roles = @form_template.dummy_stages.display_order.map { |stage| stage.actor_info['role'] }
      @form_info[:signer_infos].each_with_index do |signer_info, index|
        signer_info[:role] ||= template_roles[index]
      end
    end

    def create_public_form
      @public_form = PublicForm.new(owner: @owner)
      @public_form.group_id = @owner.active_group_id
      @public_form.template = @form_template
      @public_form.assign_attributes(@form_info)
      @public_form.goal_num ||= -1
      @public_form.publish_at = Time.zone.now
      @public_form.save!
    end
  end
end
