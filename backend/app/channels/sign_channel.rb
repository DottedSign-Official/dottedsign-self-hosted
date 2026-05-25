class SignChannel < ApplicationCable::Channel
  private

  def room_name
    'sign'
  end
end
