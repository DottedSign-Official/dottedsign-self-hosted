class Api::V1::SystemCasController < Api::ApplicationController
  before_action -> { check_email_if_present(params[:email]) }, only: [:create, :update]
  before_action -> { check_emails_if_present(params[:members]) }, only: [:access_list]
  before_action :setup_group, except: [:system_ca_list_from_email]
  before_action :check_accessibility, except: [:system_ca_list_from_email]
  before_action :setup_system_ca, only: [:show, :update, :destroy, :access_list]

  # GET
  def list
    serialize_response(:system_ca, @group.system_cas, show_secret_info: true)
  end

  # GET
  def show
    serialize_response(:system_ca, @system_ca, show_secret_info: true)
  end

  # POST
  def create
    params = create_params

    service = SystemCaService::Creator.call(@group, params)
    return error_response(service.error.key) if service.failed?

    serialize_response(:system_ca, service.result, show_secret_info: true)
  end

  # PUT
  def update
    params = update_params

    service = SystemCaService::Updator.call(@system_ca, params)
    return error_response(service.error.key) if service.failed?

    serialize_response(:system_ca, service.result, show_secret_info: true)
  end

  # DELETE
  def destroy
    @system_ca.destroy
    success_response
  end

  # PUT
  def access_list
    emails = params.require(:members)
    service = SystemCaService::AccessorUpdator.call(@system_ca, emails)
    return error_response(:service_failed, message: service.error.key) if service.failed?

    serialize_response(:system_ca, service.result, show_secret_info: true)
  end

  def system_ca_list_from_email
    email = params.require(:email)
    member = Member.find_by(email: email)
    return error_response(:member_not_found) if member.nil?
    system_ca_list = member.system_cas
    serialize_response(:system_ca, system_ca_list)
  end

  private

  def setup_group
    @group = current_member.group
    error_response(:group_not_found) if @group.nil?
  end

  def check_accessibility
    return error_response(:group_not_accessible) unless current_member.group_accessible(@group.id, 'manage_system_ca') == :accessible
  end

  def display(system_ca)
    json = system_ca.as_json(except: [:encrypted_pem])
    json[:members] = system_ca.accessor_emails
    json
  end

  def setup_system_ca
    id = params.require(:id)
    @system_ca = @group.system_cas.find(id)
    error_response(:system_ca_not_found) if @system_ca.nil?
  end

  def create_params
    params.require(system_ca_params)
    params.permit(*system_ca_params)
  end

  def update_params
    params.permit(*system_ca_params)
  end

  def system_ca_params
    [:name, :cluster_id, :token, :email, :pem]
  end
end
