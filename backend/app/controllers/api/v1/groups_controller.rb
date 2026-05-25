class Api::V1::GroupsController < Api::ApplicationController
  include GroupCheckHelper

  skip_before_action :setup_current_member, only: [:accept]
  before_action :setup_group, except: [:create, :accept, :index]
  before_action :check_group_in_belong, except: [:create, :accept, :index]
  before_action :check_group_feature
  before_action :check_group_show, only: [:show]
  before_action :check_group_update, only: [:update]
  before_action :check_group_upload, only: [:upload_icon]
  before_action :check_group_manage_user, only: [:add_member, :remove_member, :assign_role]
  before_action :check_email, only: [:add_member, :assign_role]
  before_action :setup_invited_member, only: [:add_member]
  before_action :setup_actioned_member, only: [:remove_member, :assign_role]
  before_action :setup_invite, only: [:accept]
  before_action :check_member_manage_group, only: [:index]

  def index
    group_service = Group::ObtainList.call(params[:search_group_name], params[:page], params[:per_page])
    serialize_response(:group_list, group_service.result)
  end

  def show
    success_response(@group.display(show_members: @show_members))
  end

  def create
    return error_response(:already_in_group) if current_member.group_id.present?
    group = current_member.generate_group(params[:group_name])
    success_response(group.display)
  rescue => err
    error_response(:create_group_failed, err.message)
  end

  def update
    if @group.update(update_params)
      success_response(@group.display)
    else
      error_response(:update_group_failed)
    end
  end

  def upload_icon
    icon = params.permit(:group_icon)[:group_icon]

    if icon.present?
      if @group.upload_service_file('icon', icon)
        success_response(:ok)
      else
        error_response(:upload_icon_failed)
      end
    else
      @group.remove_service_file('icon')
      @group.icon_url = ""
      @group.save!
      success_response(:ok)
    end
  end

  def add_member
    invite = @group.add_member(@invited_member)
    success_response(:ok)
  rescue ServiceError => e
    error_response(e.key)
  end

  def remove_member
    @group.remove_member(@actioned_member)
    success_response(:ok)
  rescue ServiceError => e
    error_response(e.key)
  end

  def assign_role
    return error_response(:group_not_belong) unless @actioned_member.group_id == @group.id
    roles = @group.assign_role(@actioned_member, params.require(:roles))
    success_response(roles)
  rescue ServiceError => e
    error_response(e.key)
  end

  def accept
    if @invite.accept!
      success_response(:ok)
    else
      error_response(:invite_accept_failed)
    end
  end

  private

  def setup_invited_member
    @invited_member = Member.setup_member(params[:email])
  end

  def setup_actioned_member
    @actioned_member = Member.find_by_email(params[:email])
    return error_response(:member_not_found) if @actioned_member.nil?
    return if @actioned_member.id == current_member.id
    return error_response(:admin_only_self_changeable) if @actioned_member.current_roles.pluck(:name).include?('admin')
  end

  def update_params
    params.permit(:name)
  end

  def setup_invite
    payload, header = JWT.decode(params[:invite_token], Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm })
    return error_response(:code_expire) if payload['expired_at'] < Time.now.to_i
    @invite = GroupInvite.find_by_id(payload['invite_id'])
    return error_response(:invite_not_found) if @invite.nil?
    return error_response(:invite_already_accept) if @invite.accepted?
    return error_response(:invite_not_acceptable) unless @invite.waiting?
    invite_member = @invite.member
    return if invite_member.is_registered
    return error_response(:need_register_info, nil, { member_email: invite_member.email }) if params[:password].blank?
    invite_member.register(password: params[:password], name: params[:name])
  rescue JWT::DecodeError => e
    error_response(:invalid_invite_token)
  end

end
