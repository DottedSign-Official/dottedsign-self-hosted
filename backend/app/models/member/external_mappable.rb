class Member
  module ExternalMappable
    extend ActiveSupport::Concern

    EXTERNAL_ID_KEYS = [:uid]
    SPLIT_SYMBOL = '_'.freeze

    class_methods do
      private

      def serialize_external_id(**kwargs)
        EXTERNAL_ID_KEYS.map { |key| kwargs[key] or raise "info missing mapping key: #{key}" }.join(SPLIT_SYMBOL)
      end
    end

    def deserialize_external_id
      external_id.split(SPLIT_SYMBOL).map.with_index { |value, i| [EXTERNAL_ID_KEYS[i], value] }.to_h
    end
  end
end
