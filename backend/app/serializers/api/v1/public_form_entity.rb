class Api::V1::PublicFormEntity < ServiceEntity
  expose :id, :uuid, :form_name, :description, :signer_infos, :status, :sent_num, :goal_num

  expose :finish_num

  expose :template_name do |form|
    form.template.file_name
  end

  expose :created_at do |form|
    form.created_at&.to_i
  end

  expose :end_at do |form|
    form.end_at&.to_i
  end

  expose :reach_limit do |form|
    form.reach_limit?
  end

  expose :template_entity, as: :form_info, if: { show_detail: true }

  private

  alias :form :object

  def template_entity
    template_entity_options = {
      with_download_link: true,
      with_upload_link: true,
      with_tag: true,
      with_xfdf: true
    }
    @template_entity ||= Api::V1::TemplateEntity.represent(form.template, options.merge(template_entity_options))
  end
end
