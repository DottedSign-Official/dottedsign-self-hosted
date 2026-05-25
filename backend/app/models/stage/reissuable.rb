class Stage
  module Reissuable
    extend ActiveSupport::Concern

    def reissuable?
      processing_file_failed?
    end

  end
end