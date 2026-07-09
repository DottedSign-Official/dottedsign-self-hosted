class Api::V1::PublicFormsController < Api::ApplicationController
  include PublicForms::CheckHelper
  include PublicForms::FormHelper

  # accessibility check (in ApplicationController)
  skip_before_action :setup_current_member, only: [:preview]

  # accessibility check (in CheckHelper)
  before_action :security_checked, except: [:preview]

  # params processing (in PublicForms::FormHelper)
  before_action :process_form_params, only: [:create, :create_from_template, :update]

  # accessibility check (in PublicForms::CheckHelper)
  before_action :check_form_params, only: [:create, :create_from_template, :update]
  before_action :check_and_setup_owned_form, only: [:show, :destroy, :change_status, :export_csv, :compress]
  before_action :check_signer_email, only: [:preview]

  # params and format check (in CheckHelper)
  before_action -> { check_storable_name(params[:form_name]) }, only: [:create, :create_from_template, :update]

  # params and format check (in PublicFormsController)
  before_action :check_stage_emails, only: [:create, :create_from_template, :update]
  before_action :check_status, only: [:change_status]
  before_action :check_publishable, only: [:change_status]

  # template_params check
  before_action :process_source_params, only: [:create, :update]
  before_action :check_template_params, only: [:create, :update]
  before_action :check_field_setting, :check_field_setting_group_params, only: [:create, :update]

  def index
    forms = PublicForm.related_to(current_member).active.display_order.page(params[:page] || 1).per(params[:per_page] || PublicForm::PER_PAGE)
    serialize_response(:public_form_list, forms)
  end

  def show
    show_detail = strict_boolean(params[:with_detail]) || false
    serialize_response(:public_form, @form, show_detail: show_detail)
  end

  def create
    setup = Form::Create.call(current_member, create_params, template_params, template_setting_params)
    if setup.success?
      serialize_response(:public_form, setup.public_form, show_detail: true)
    else
      error_response(setup.error.key, setup.error.message)
    end
  end

  # corresponding to SaaS 'create' API
  def create_from_template
    setup = Form::CreateFromTemplate.call(current_member, params.require(:template_id), create_params, template_setting_params)
    if setup.success?
      serialize_response(:public_form, setup.public_form)
    else
      error_response(setup.error.key, setup.error.message)
    end
  end

  def update
    setup = Form::Update.call(current_member, params.require(:form_id), update_params, template_params, template_setting_params)
    if setup.success?
      serialize_response(:public_form, setup.public_form, show_detail: true)
    else
      error_response(setup.error.key, setup.error.message)
    end
  end

  def destroy
    return error_response(:form_should_unpublish) if @form.publish?
    if @form.set_delete
      serialize_response(:public_form, @form)
    else
      error_response(:delete_form_failed)
    end
  end

  def change_status
    if @form.update(status: PublicForm.statuses[params[:status]])
      serialize_response(:public_form, @form)
    else
      error_response(:update_form_failed)
    end
  end

  def preview
    preview_service = Form::Preview.call(params.require(:form_uuid), signer_info)
    if preview_service.success?
      serialize_response(:public_form, preview_service.result, show_detail: true)
    elsif preview_service.error.error_obj.present?
      error_response(preview_service.error.key, preview_service.error.message, preview_service.error.error_obj)
    else
      error_response(preview_service.error.key, preview_service.error.message)
    end
  end

  def export_csv
    return error_response(:form_should_unpublish) if @form.publish?
    zone = TimezoneMapping[:hour_zone][params[:zone].to_f]
    content = @form.csv_content(zone)
    file_name = "#{@form.form_name}_#{Time.current.strftime('%Y%m%d%H%M%S')}.csv"
    send_data content, filename: file_name, disposition: 'attachment', type: 'text/csv; charset=utf-8; header=present'
  end

  # 中華要求要 點擊下載會做兩件事 send下載連接mail給owner & 直接下載檔案
  def compress
    return error_response(:form_should_unpublish) if @form.publish?
    # return error_response(:form_is_still_compressing) if @form.compressing?
    result = PublicForms::Compress.call(@form.id)
    if result.success?
      Notification::DownloadPublicFormMailWorker.perform_async(@form.id)
      download_info = result.result[:download_info]
      send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
    else
      error_response(result.error.key, result.error.message)
    end
  end

  private

  def create_params
    require_attrs = [:form_name, :signer_infos]
    params.require(require_attrs)
    form_params
  end

  def update_params
    form_params
  end

  def form_params
    params[:end_at] = Time.at(params[:end_at]) if params[:end_at]&.positive?
    params.permit(:form_name, :status, :description, :goal_num, :end_at, signer_infos: [:signer_type, :name, :email, :phone, requisite: [:name, :email]])
  end

  def template_params
    params.require(:stages)
    params[:file_name] = params[:form_name]
    params[:has_order] = true # templates for public form need to be ordered
    params[:usage] = Template.usages[:public_form]
    params.permit(:file_name, :has_order, :usage, tags: [], stages: [:role, :action, pdf_object_info: [], xfdf_info: xfdf_permit_attrs, field_setting_groups: field_setting_group_permit_attrs, attachment_setting: attachment_permit_attrs, verify: verify_attrs, stage_setting: stage_setting_attrs])
  end

  def check_stage_emails
    params.require(:signer_infos).each do |signer_info|
      check_email(signer_info[:email]) if signer_info[:email].present?
    end
  end

  def check_status
    error_response(:invalid_form_status) if PublicForm.statuses.keys.exclude?(params[:status])
  end

  def check_publishable
    return unless params[:status] == 'publish'
    return error_response(:form_reach_limit) if @form.reach_limit?
    return error_response(:form_template_not_usable) if @form.terminated?
  end
end
