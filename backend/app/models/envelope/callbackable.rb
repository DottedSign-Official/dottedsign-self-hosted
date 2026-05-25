class Envelope
  module Callbackable
    extend ActiveSupport::Concern

    include TaskRelated::Callbackable
  end
end
