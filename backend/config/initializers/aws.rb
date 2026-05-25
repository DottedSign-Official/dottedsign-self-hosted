# Copy from https://github.com/aws/aws-sdk-rails/blob/master/lib/aws/rails/mailer.rb
# for action mailer deliver method ses

module Aws
  module SES
    class Mailer
      # @param [Hash] options Passes along initialization options to
      #   [Aws::SES::Client.new](https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/SES/Client.html#initialize-instance_method).
      def initialize(options = {})
        @client = SES::Client.new(options)
      end

      # Rails expects this method to exist, and to handle a Mail::Message object
      # correctly. Called during mail delivery.
      def deliver!(message)
        send_opts = {}
        send_opts[:raw_message] = {}
        send_opts[:raw_message][:data] = message.to_s

        if message.respond_to?(:destinations)
          send_opts[:destinations] = message.destinations
        end

        @client.send_raw_email(send_opts).tap do |response|
          message.header[:ses_message_id] = response.message_id
        end
      end

      # ActionMailer expects this method to be present and to return a hash.
      def settings
        {}
      end
    end
  end
end

ActionMailer::Base.add_delivery_method(:ses, Aws::SES::Mailer, region: 'us-east-1') if Settings.mail.delivery_method == 'ses'
