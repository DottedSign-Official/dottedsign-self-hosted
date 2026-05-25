class SignTask
  module Storable
    extend ActiveSupport::Concern

    include TaskRelated::Storable

    included do
      has_one :full_file, -> { uploaded.where(label: 'full') }, as: :storable, class_name: 'ServiceFile'
      # created before applying expired watermark in WatermarkApplyWorker
      has_one :pristine_original_file, -> { uploaded.where(label: 'pristine_original') }, as: :storable, class_name: 'ServiceFile'
    end

    def stage_attachment_files
      ServiceFile.uploaded.where(storable_type: stage_class, storable_id: stages.pluck(:id)).where('label like ?', '%attachment_%')
    end

  end
end
