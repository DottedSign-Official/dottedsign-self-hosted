class Envelope
  module GroupSearchable
    extend ActiveSupport::Concern

    include TaskRelated::GroupSearchable
  end
end
