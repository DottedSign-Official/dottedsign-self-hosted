class Api::V1::Members::InfoController < Api::ApplicationController
  before_action :check_file_type!, only: [:upload_avatar]
  before_action :check_preference_params, only: [:preference]

  def me
    with_signature = strict_boolean(params[:include_signature])
    success_response(current_member.private_info(with_signature: with_signature))
  end

  def timelines
    show_delete = strict_boolean(params[:show_delete])
    timelines = current_member.timelines(format_time_range, show_delete, params[:page], params[:per_page] || SignEvent::PER_PAGE)
    success_response(timelines)
  end

  def modify
    current_member.update(name: params[:name]) if params[:name].present?
    if params[:lang].present?
      lang = LangHandle.upcase_lang(params[:lang])
      return error_response(:invalid_language) if Profile::VALID_LANG.exclude?(lang)
      current_member.profile.update(language: lang)
    end
    success_response(current_member.private_info)
  end

  def upload_avatar
    file_name = "avatar.#{@file_type}"
    content_type = "image/#{@file_type}"
    if current_member.upload_service_file('avatar', io: params.require(:avatar), content_type: content_type, filename: file_name, force_upload: true)
      success_response(:ok)
    else
      error_response(:upload_avatar_failed)
    end
  end

  def contact_list
    success_response(current_member.contact_list)
  end

  # PUT
  def preference
    current_member.update_preference(preference_params)
    success_response(current_member.private_info)
  end

  private

  def check_preference_params
    return error_response(:invalid_params, 'invalid time zone') if params[:time_zone].present? && TimezoneMapping[:zone_hour].keys.exclude?(params[:time_zone])
  end

  def preference_params
    preference_attrs = Settings.default.preference.keys
    process_preference_params(params)
    params.require([:phone_code, :phone_number]) if params[:otp_via_phone] && (current_member.phone_code.blank? || current_member.phone_number.blank?)
    params[:preferences] = params.permit(preference_attrs)
    params.permit(:phone_code, :phone_number, preferences: preference_attrs)
  end

  def process_preference_params(params)
    params[:otp_via_email] = current_member.otp_via_email if params[:otp_via_email].nil?
    params[:otp_via_phone] = current_member.otp_via_phone if params[:otp_via_phone].nil?
    params[:force_receiver_otp] = current_member.force_receiver_otp if params[:force_receiver_otp].nil?
  end

  def check_file_type!
    file_path = params[:avatar].tempfile.path
    file = File.open(file_path)
    @file_type = MimeMagic.by_magic(file)&.type&.split('/')&.last
    error_response(:invalid_file_type) if Member::Info::ALLOW_AVATAR_FILE_TYPES.exclude?(@file_type)
  end

end
