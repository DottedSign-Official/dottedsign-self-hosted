class SignTask
  module Transferable
    extend ActiveSupport::Concern
  
    include TaskRelated::Transferable
  end
end
