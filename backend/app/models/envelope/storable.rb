class Envelope
  module Storable
    extend ActiveSupport::Concern

    include TaskRelated::Storable

    included do
      has_one :attachment_file, -> { uploaded.where(label: 'attachment') }, as: :storable, class_name: 'ServiceFile'
    end

    def stage_attachment_files
      all_task_stage_ids = SignStage.joins(:sign_task).where(sign_tasks: { envelope_id: id }).pluck(:id)
      ServiceFile.uploaded.where(storable_type: SignStage.name, storable_id: all_task_stage_ids).where('label LIKE ?', '%attachment_%')
    end

    def task_files_for_label(label)
      if label == 'attachment'
        stage_attachment_files
      else
        all_task_ids = SignTask.where(envelope_id: id).pluck(:id)
        ServiceFile.uploaded.where(storable_type: SignTask.name, storable_id: all_task_ids, label: label)
      end
    end
  end
end
