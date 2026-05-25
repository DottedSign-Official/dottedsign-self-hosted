class SignTask
  module Accessible
    extend ActiveSupport::Concern

    include TaskRelated::Accessible
  end
end
