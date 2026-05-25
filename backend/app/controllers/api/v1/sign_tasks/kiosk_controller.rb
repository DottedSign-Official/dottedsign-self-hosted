class Api::V1::SignTasks::KioskController < Api::ApplicationController
  before_action :check_stage_infos, only: [:create]
  def create
    creator = Factories::TemplateTask::Kiosk.call(current_member, params.require(:template_id), create_params, setting_info: { need_ca: true }, client_info: client_params, pdf_base64: params[:file])
    if creator.success?
      creator.task.start(client_params)
      success_response(sign_task_id: creator.result)
    else
      error_response(creator.error.key)
    end
  end

  def verify
    kiosk_read = Kiosk::Read.call(params.require(:sign_task_id), current_member, read_params, client_params)
    if kiosk_read.success?
      serialize_response(:sign_task, kiosk_read.result, service: kiosk_read, with_image_info: true, with_xfdf: true)
    elsif kiosk_read.error.error_obj.present?
      error_response(kiosk_read.error.key, kiosk_read.error.message, kiosk_read.error.error_obj)
    else
      error_response(kiosk_read.error.key, kiosk_read.error.message)
    end
  end

  def sign
    kiosk_sign = Kiosk::Sign.call(params.require(:sign_task_id), current_member, sign_params, client_params)
    if kiosk_sign.success?
      serialize_response(:sign_task, kiosk_sign.result, service: kiosk_sign, with_image_info: false, with_xfdf: false)
    elsif kiosk_sign.error.error_obj.present?
      error_response(kiosk_sign.error.key, kiosk_sign.error.message, kiosk_sign.error.error_obj)
    else
      error_response(kiosk_sign.error.key, kiosk_sign.error.message)
    end
  end

  private

  def create_params
    params[:sign_type] = :kiosk
    params.permit(:sign_type, :file_name, stages: [:role, others: [:informable, requisite: [:name, :email, :phone]]])
  end

  def read_params
    params.permit(actor_info: [:name, :email, :phone])
  end

  def sign_params
    params.permit(signature_info: sign_permit_attrs, attachment_info: [:attachment_id, :attachment_type, :uploaded])
  end

  def check_stage_infos
    return error_response(:invalid_params, 'invalid template stages') if Template.with_actions(['review']).exists?(id: params[:template_id])
    params[:stages].each do |stage_info|
      break error_response(:invalid_params) unless valid_stage_info?(stage_info)
    end
  end

  def valid_stage_info?(stage_info)
    return true if stage_info[:requisite].blank?
    (stage_info[:requisite].values - StageSetting::VALID_REQUISITE_VALUES).blank?
  end

end
