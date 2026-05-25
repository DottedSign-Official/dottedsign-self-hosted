class Envelope
  module Signable
    extend ActiveSupport::Concern

    include TaskRelated::Signable
  end
end
