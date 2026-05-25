module MemberHelper

  def setup_application
    client = Doorkeeper::Server.new(self).client
    if client
      @app = client.application
    else
      error_response(:client_not_found)
    end
  end

  def check_password_confirmation
    error_response(:password_and_confirmation_not_match) if params[:password] != params[:password_confirmation]
  end

end
