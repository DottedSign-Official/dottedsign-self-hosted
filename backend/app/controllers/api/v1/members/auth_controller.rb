class Api::V1::Members::AuthController < Api::ApplicationController
  skip_before_action :setup_current_member, except: [:send_confirm, :change_password]
  before_action :setup_application, only: [:register, :login]
  before_action -> { check_email(check_options: [:domain, :registration]) }, only: [:register]
  before_action :check_password_confirmation, only: [:reset_password, :change_password]
  before_action :check_email, only: [:login, :forget_password]

  include MemberHelper

  def register
    member = Member.register(register_params)
    # uuid with generate in db level, so need to reload to get it
    member.reload
    success_response(member.auth_info(@app))
  end

  # TODO: remove ,not using, frontend call ouath/token not /login
  def login
    member = Member.registered.find_by(email: params[:email])
    return error_response(:invalid_member) if member.nil?
    if member.valid_for_authentication? { member.valid_password?(params[:password]) }
      success_response(member.auth_info(@app))
    else
      error_response(:invalid_member)
    end
  end

  def send_confirm
    return error_response(:already_confirmed) if current_member.confirmed?
    current_member.send_confirmation_instructions
    success_response(:ok)
  end

  def confirm
    member = Member.registered.confirm_by_token(params[:confirmation_token])
    if member.errors.blank?
      success_response(:ok)
    else
      error_response(:invalid_token, member.errors.full_messages)
    end
  end

  def forget_password
    member = Member.registered.find_by_email(params[:email])
    return error_response(:member_not_found) if member.nil?
    member.send_reset_password_instructions
    success_response(:ok)
  end

  def reset_password
    member = Member.registered.reset_password_by_token(reset_params)
    if member.errors.blank?
      success_response(:ok)
    elsif member.errors.messages[:reset_password_token].present?
      error_response(:token_invalid)
    elsif member.errors.messages[:password_confirmation].present?
      error_response(:password_not_match)
    else
      error_response(:unknown, error_message: member.errors.full_messages)
    end
  end

  def change_password
    return error_response(:password_not_match) unless current_member.valid_password?(change_params[:old_password])
    return error_response(:password_same_as_last_modification) if current_member.valid_password?(change_params[:password])

    if current_member.reset_password(change_params[:password], change_params[:password_confirmation])
      success_response(:ok)
    else
      error_response(:unknown, error_message: member.errors.full_messages)
    end
  end

  private

  def register_params
    params[:from_application_id] = @app.id
    require_attrs = [:email, :password, :from_application_id]
    permit_attrs = require_attrs + [:name]
    params.require(require_attrs)
    params.permit(*permit_attrs)
  end

  def reset_params
    require_attrs = [:reset_password_token, :password, :password_confirmation]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

  def change_params
    require_attrs = [:old_password, :password, :password_confirmation]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end
end
