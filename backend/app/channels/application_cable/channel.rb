module ApplicationCable
  class Channel < ActionCable::Channel::Base
    def subscribed
      stream_from room
    end

    def unsubscribed
      data = {
        event: 'disconnect'
      }.as_json
      ActionCable.server.broadcast(room, data)
      stop_stream_from room
    end

    def receive(data)
      ActionCable.server.broadcast(room, data)
    end

    private

    def room
      "#{room_name}:#{room_id}"
    end

    def room_name
      'default'
    end
  end
end
