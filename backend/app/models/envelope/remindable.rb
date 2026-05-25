class Envelope
  module Remindable
    extend ActiveSupport::Concern
  
    include TaskRelated::Remindable
  end
end
