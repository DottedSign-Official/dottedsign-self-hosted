class ServiceFile
  module Cleanable
    extend ActiveSupport::Concern

    included do
      after_rollback :purge_file, on: :create
    end

    def delete_file
      purge_file
    ensure
      self.deleted_at = Time.zone.now
      self.save!
    end

    private

    def purge_file
      file.purge if file.attached?
      thumbnail.purge if thumbnail&.attached?
    end
  end
end
