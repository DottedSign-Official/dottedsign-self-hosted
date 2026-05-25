module TaskRelated
  module Callbackable
    extend ActiveSupport::Concern

    def callback_params
      {
        completed_at: completed_at.to_i,
        download_link: {
          completed: completed_file.download_link,
          audit_trail: audit_trail_file.download_link,
          signature_compressed: signature_compressed_file&.download_link
        }
      }
    end
  end
end
