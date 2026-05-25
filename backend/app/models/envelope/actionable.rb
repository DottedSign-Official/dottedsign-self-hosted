class Envelope
  module Actionable
    extend ActiveSupport::Concern

    include TaskRelated::Actionable
  end
end
