# frozen_string_literal: true

module Requests
  module JsonHelper
    def json
      return {} if response.body.blank?
      JSON.parse(response.body)
    end
  end
end
