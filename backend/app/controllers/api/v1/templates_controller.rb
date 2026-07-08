class Api::V1::TemplatesController < Api::ApplicationController
  before_action :check_and_setup_template, only: [:show, :update, :destroy, :file_share]
  before_action -> { check_and_setup_template('duplicate') }, only: [:duplicate]
  before_action :process_source_params, only: [:create, :update]
  before_action :check_owner_template, only: [:update, :destroy]
  before_action :check_duplicate_code, only: [:create, :update]
  before_action :check_field_setting, :check_field_setting_group_params, only: [:create, :update]
  before_action :check_template_params, only: [:create, :update]

  def index
    templates = Template.general.where(id: search_related_template_ids).active.display_order.page(params[:page] || 1).per(params[:per_page] || Template::PER_PAGE)
    result = {
      templates: templates.display_infos(current_member.id),
      total_count: templates.total_count,
      current_page: templates.current_page,
      total_pages: templates.total_pages
    }
    success_response(result)
  end

  def create
    template = Template.create_from_request(current_member.id, template_params, template_setting_params)
    current_member.tag(template, with: params[:tags], on: :tags) if params[:tags].present?
    serialize_response(:template, template, with_upload_link: true, with_tag: true)
  end

  def show
    serialize_response(:template, @template, with_download_link: true, with_tag: true, with_xfdf: true)
  end

  def update
    @template.update_from_request(template_params, template_setting_params)
    current_member.tag(@template, with: params[:tags], on: :tags) if params.key?(:tags)
    serialize_response(:template, @template, with_upload_link: true, with_tag: true)
  end

  def destroy
    return error_response(:shared_template_has_other_groups) if ShareSetting.where(shared: @template).present?
    @template.deleted!
    success_response(:ok)
  end

  def file_share
    template_file = @template.original_file
    return error_response(:file_not_ready) if template_file.nil?
    task = SignTask.find_by_id(params[:sign_task_id])
    return error_response(:task_not_found) if task.nil?
    template_file.copy_to(task, 'original')
    task.add_sign_event(:task_from_template, current_member.id, client_info: { client: 'signature_center' })
    success_response(:ok)
  end

  def duplicate
    duplicator = Factories::Template::Duplicate.call(current_member, @template, params[:template_name])
    return error_response(duplicator.error.key, duplicator.error.message) if duplicator.failed?
    success_response(duplicator.result)
  end

  private

  def search_related_template_ids
    templates = Template.related_to(current_member)
    templates = templates.where("file_name ILIKE ?", "%#{params[:terms]}%") if params[:terms].present?
    templates = templates.where("code ILIKE ?", "%#{params[:code]}%") if params[:code].present?
    templates = templates.tagged_with_case_sensitive(params[:search_tags], owned_by: current_member) if params[:search_tags].present?
    exclude_templates = params[:exclude_actions].present? ? templates.with_actions(params[:exclude_actions]) : Template.none
    (templates - exclude_templates).pluck(:id)
  end

  def template_params
    params[:has_order] = strict_boolean(params[:has_order]) unless params[:has_order].nil?
    params.permit(:file_name, :has_order, :group_id, :code, stages: [:role, :action, pdf_object_info: [], xfdf_info: xfdf_permit_attrs, field_setting_groups: field_setting_group_permit_attrs, attachment_setting: attachment_permit_attrs, verify: verify_attrs, stage_setting: stage_setting_attrs])
  end

  def check_duplicate_code
    except_ids = []
    except_ids << @template.id if action_name == 'update'
    error_response(:duplicate_template_code) if Template.duplicate_with(params[:code], except_ids: except_ids)
  end
end
