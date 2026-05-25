module Member::Info
  extend ActiveSupport::Concern

  ALLOW_AVATAR_FILE_TYPES = %w[png jpg jpeg].freeze

  def public_info(extend_fields=[], fields=nil)
    as_json.merge(profile_public_info)
  end

  def private_info(with_signature: false)
    info = as_json(only: [:id, :name, :email, :phone_code, :phone_number, :unconfirmed_email, :is_registered, :group_id])
    info[:confirmed] = confirmed?
    info[:created_at] = created_at.to_i
    info[:signatures] = signatures if with_signature
    info[:preference] = preference_info
    info.merge!(profile.public_info(only: [:language, :icon_url]))
    info[:profile] = profile_public_info
    info[:current_permission] = current_permission
    info[:is_admin] = admin_of_group?(group_id)
    info
  end

  def full_info
    info = private_info
    info[:sign_in_count] = sign_in_count
    info[:confirmed_at] = confirmed_at
    info[:confirmation_sent_at] = confirmation_sent_at
    info
  end

  def auth_info(app=nil)
    data = private_info
    data[:token_info] = token_info(app)
    data
  end

  def token_info(app=nil)
    app ||= from_application
    token = access_token_for(app)
    info = Doorkeeper::OAuth::TokenResponse.new(token).body
    info.merge(for_app: app.name)
  end

  def timelines(time_range, show_delete=true, page=nil, per_page=nil)
    events = SignEvent.all
    events = events.where(task_deleted: false) unless show_delete
    events = events.where(created_at: time_range) if time_range.present?
    events.timelines_for(id, page, per_page)
  end

  def profile_public_info
    profile.public_info
  end

  def display_name
    name.present? ? name : email.split('@').first
  end

  def contact_list
    contacts.basic_infos
  end

  def phone
    "#{phone_code}#{phone_number}"
  end

  def sms
    phone
  end

  def verify_infos
    verify_infos = []
    verify_infos << {verify_type: 'phone', verify_source: phone} if otp_via_phone
    verify_infos << {verify_type: 'email', verify_source: email} if otp_via_email || verify_infos.blank?
    verify_infos
  end

  def verify_source(type)
    if type == 'email'
      {email: email}
    elsif type == 'phone'
      {phone_code: phone_code, phone_number: phone_number}
    else
      {}
    end
  end

  def i18n_locale
    profile_lang = profile.language
    I18n.available_locales.include?(profile_lang.to_sym) ? profile_lang : Settings.default.profile.language
  end

end
