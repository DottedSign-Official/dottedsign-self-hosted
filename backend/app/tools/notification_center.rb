class NotificationCenter < Base
  REQUESTER = JsonRequester.new(Settings.notification.host)

  class << self
    def target_push(event, member_id, options={})
      path = Settings.notification.path.target_push
      params = {event: event, member_id: member_id, options: options}
      REQUESTER.http_send(:post, path, params)
    end

    def batch_push(event, member_ids, options={})
      path = Settings.notification.path.target_push
      params = {event: event, member_ids: member_ids, options: options}
      REQUESTER.http_send(:post, path, params)
    end
  end

end
