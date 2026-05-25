class Api::V1::PublicForms::FormTasksController < Api::ApplicationController
  include PublicForms::CheckHelper
  include PublicForms::FormHelper
  include PublicForms::FormTokenAuthenticationHelper

  # authentication for form token (in PublicForms::FormTokenAuthenticationHelper)
  before_action :setup_member_from_form_token, only: [:read, :sign], if: -> { params['form_token'].present? }

  # accessibility check (in ApplicationController)
  skip_before_action :setup_current_member, except: [:index]

  # accessibility check (in CheckHelper)
  before_action :security_checked, only: [:index]
  before_action :check_task_category, only: [:index]

  # accessibility check (in PublicForms::CheckHelper)
  before_action :check_and_setup_form, only: [:start]

  # params and format check (in PublicForms::CheckHelper)
  before_action :check_signer_email, only: [:start, :read]

  def index
    form_tasks, summary = form_tasks_of_category_and_summary(params[:category])
    serialize_response(:form_task_list, form_tasks, summary: summary)
  end

  def start
    start_service = Form::Start.call(params.require(:form_uuid), signer_info, client_params)
    if start_service.success?
      success_response(start_service.result)
    elsif start_service.error.error_obj.present?
      error_response(start_service.error.key, start_service.error.message, start_service.error.error_obj)
    else
      error_response(start_service.error.key, start_service.error.message)
    end
  end

  def read
    read_service = Form::Read.call(@token_info['task_id'], current_member, read_params, client_params)
    if read_service.success?
      serialize_response(:form_task, read_service.task, service: read_service, with_image_info: true, with_xfdf: true)
    elsif read_service.error.error_obj.present?
      error_response(read_service.error.key, read_service.error.message, read_service.error.error_obj)
    else
      error_response(read_service.error.key, read_service.error.message)
    end
  end

  def sign
    sign_service = Form::Sign.call(@token_info['task_id'], current_member, sign_params, client_params)
    if sign_service.success?
      serialize_response(:form_task, sign_service.task, service: sign_service)
    elsif sign_service.error.error_obj.present?
      error_response(sign_service.error.key, sign_service.error.message, sign_service.error.error_obj)
    else
      error_response(sign_service.error.key, sign_service.error.message)
    end
  end

  private

  def read_params
    params[:signer_info] = signer_info
    params.permit(signer_info: [:name, :email], verify_info: verify_info_permit_attrs)
  end

  def sign_params
    params.permit(:form_token, signature_info: sign_permit_attrs, verify_info: verify_info_permit_attrs, attachment_info: [:attachment_id, :attachment_type, :uploaded])
  end

  def form_tasks_of_category_and_summary(category)
    form_task_ids = setup_form_task_ids
    category_ids = SignTask.category_ids(form_task_ids, current_member.id)
    form_tasks = SignTask.where(id: category_ids[category.to_sym])
    form_tasks = form_tasks.where("sign_tasks.file_name ILIKE ?", "%#{params[:terms]}%") if params[:terms].present?
    form_tasks = form_tasks.send(display_order(category)).page(params[:page] || 1).per(params[:per_page] || SignTask::PER_PAGE)
    summary = category_ids.transform_values(&:length)
    return form_tasks, summary
  end

  def setup_form_task_ids
    related_ids = SignTask.related_ids(current_member)
    # only include tasks whose all form sign stages are done
    SignTask.form.joins(:sign_stages).merge(SignStage.with_form_signer)
      .where(id: related_ids)
      .group('sign_tasks.id')
      .having('COUNT(*) = SUM(CASE WHEN sign_stages.status = ? THEN 1 ELSE 0 END)', SignStage.statuses[:done])
      .pluck(:id)
  end
end
