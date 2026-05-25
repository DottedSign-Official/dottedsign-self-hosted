class Api::HomeController < Api::ApplicationController

  def permissions
    info = {
      developer_console: current_member.super_admin?,
      group_enable: GROUP_USE
    }
    success_response(info)
  end

end
