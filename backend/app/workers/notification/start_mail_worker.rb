module Notification
  class StartMailWorker < GeneralWorker
    sidekiq_options queue: :low

    def perform(id, source_type = 'SignTask')
      @source = source_type.constantize.find_by_id(id)
      return if @source.nil?
      return if @source.is_a?(SignTask) && @source.in_envelope?
      send_cc_mail if @source.need_cc?
    end

    private

    def format_cc_map
      cc_info = @source.setting&.cc_info || []
      cc_info.map do |info|
        cc_name = info['name'] || info['email']
        [info['email'], cc_name]
      end.to_h
    end

    def send_cc_mail
      cc_map = format_cc_map
      MailCenter.delay.raise_if_server_failed('cc_start_notification', cc_map, @source.related_mail_infos, @source.owner.email, @source.owner.display_name, @source.file_name, @source.receiver_lang)
    end

  end
end
