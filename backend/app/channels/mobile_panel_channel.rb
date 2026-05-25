class MobilePanelChannel < ApplicationCable::Channel
  private

  def room_name
    'mobile_panel'
  end
end
