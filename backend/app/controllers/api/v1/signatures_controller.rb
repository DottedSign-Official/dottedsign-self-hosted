class Api::V1::SignaturesController < Api::ApplicationController
  include PublicForms::FormTokenAuthenticationHelper

  # authentication for form signer (in PublicForms::FormTokenAuthenticationHelper)
  prepend_before_action :allow_form_token_authentication_strategy, only: [:guest_signature, :images_to_mp4_base64]

  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy, only: [:create, :destroy, :guest_signature, :images_to_mp4_base64]

  before_action :security_checked
  before_action :check_acceptance!, only: [:create, :destroy]
  before_action :check_file_type!, only: [:create]
  before_action :check_duplicate_signature, only: [:create]

  def index
    signatures = current_member.signatures.category_recent.signatures_of(params[:category])
    if signatures.nil?
      error_response(:invalid_category)
    else
      serialize_response(:signature, signatures)
    end
  end

  def show
    signature = Signature.find_by(id: params.require(:id), member_id: current_member.id)
    return error_response(:signature_not_found) if signature.nil?
    serialize_response(:signature, signature)
  end

  def create
    signature = Signature.setup(current_member, signature_params, sign_video: params[:sign_video], sign_photo: params[:sign_photo], sign_stroke: params[:sign_stroke])
    serialize_response(:signature, signature)
  rescue => error
    error_response(error.key)
  end

  def guest_signature
    guest_signature = GuestSignature.setup(guest_signature_params, sign_video: params[:sign_video], sign_photo: params[:sign_photo], sign_stroke: params[:sign_stroke])
    success_response(guest_signature.display)
  rescue => error
    error_response(error.key)
  end

  def destroy
    signature = current_member.signatures.find_by_id(params[:id])
    return error_response(:signature_not_found) if signature.nil?
    signature.destroy!
    success_response(category: signature.display_category)
  end

  def images_to_mp4_base64
    convert_result = SignatureVideo::ImageConvertMp4Base64.call(params[:base64_images])
    if convert_result.success?
      success_response(convert_result.result)
    else
      error_response(:convert_failed, convert_result.error)
    end
  end

  private

  def signature_params
    require_attrs = [:file_type, :category, :raw]
    params.require(require_attrs)
    params[:file_type] = params[:file_type].split('/').last
    params.permit(*require_attrs.flatten)
  end

  def guest_signature_params
    require_attrs = [:raw]
    params.require(require_attrs)
    params.permit(:category, *require_attrs)
  end

  def check_file_type!
    error_response(:invalid_file_type) if Signature::ALLOW_FILE_TYPES.exclude?(params[:file_type])
  end

  def check_duplicate_signature
    if params[:category] == 'stamp'
      stamp_num = current_member.signatures.where(category: params[:category]).count
      error_response(:stamp_limit_reached) if stamp_num >= 20
    elsif Signature::ALLOW_SIGNATURE_CATEGORIES.include?(params[:category])
      signature = current_member.signatures.find_by(category: params[:category])
      error_response(:signature_duplicate) if signature.present?
    end
  end
end
