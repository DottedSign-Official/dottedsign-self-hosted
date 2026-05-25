class SocketCenter
  class << self

    def broadcast(member_id, channel: 'sign', event: 'main', payload: {})
      return if member_id.nil?
      params = {
        event: event,
        payload: payload
      }.as_json
      ActionCable.server.broadcast("#{channel}:#{member_id}", params)
    end

    def broadcast_to_many(member_ids, channel: 'sign', event: 'main', payload: {})
      return if member_ids.blank?
      params = {
        event: event,
        payload: payload
      }.as_json
      member_ids.each { |member_id| ActionCable.server.broadcast("#{channel}:#{member_id}", params) }
    end

    def broadcast_to_code(code, channel: 'sign', event: 'main', payload: {})
      return if code.nil?
      params = {
        event: event,
        payload: payload
      }.as_json
      ActionCable.server.broadcast("#{channel}:#{code}", params)
    end
  end

end
