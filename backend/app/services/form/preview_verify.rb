module Form
  class PreviewVerify < ServiceCaller

    def initialize(form_uuid, signer_info)
      @form_uuid = form_uuid
      @signer_info = signer_info
    end

    def call
      setup_public_form
      check_signer_info
      @result = @public_form
    end

    private

    def setup_public_form
      @public_form = PublicForm.find_by(uuid: @form_uuid)
      raise ServiceError.new(:form_not_found) unless @public_form
      raise ServiceError.new(:form_is_deleted) if @public_form.is_deleted?
      raise ServiceError.new(:form_not_publish) unless @public_form.publish?
      return unless @public_form.group_id.present? && @public_form.group_id != @public_form.owner.active_group_id
      @public_form.unpublish!
      raise ServiceError.new(:form_not_publish)
    end

    def check_signer_info
      first_signer_info = @public_form.signer_infos.first
      first_requisite = first_signer_info['requisite']
      need_types = first_requisite.select { |type, status| status == 'required' }.keys
      ready_types = @signer_info.select { |type, value| value.present? }.keys.map(&:to_s)
      raise ServiceError.new(
        :signer_info_not_ready,
        form_name: @public_form.form_name,
        form_description: @public_form.description,
        signer_requisite: first_requisite,
        signer_role: first_signer_info['role']
      ) if (need_types - ready_types).present?
    end
  end
end
