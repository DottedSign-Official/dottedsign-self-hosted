class Stage
  module Storable
    extend ActiveSupport::Concern

    include ShareStorable

    included do
      has_many :service_files, as: :storable, dependent: :destroy
      has_many :attachments, -> { uploaded.where('label like ?', 'attachment_%') }, as: :storable, class_name: 'ServiceFile'
      has_one :stage_file, -> { uploaded.where('label like ?', 'stage_%') }, as: :storable, class_name: 'ServiceFile'
    end

    def attachment_ready?(attachment_ids = [], delete_redundancy: false)
      return false if initial?
      attachment_ids ||= []
      uploaded_attachment_ids = attachments.pluck(:label)
      required_attachment_ids = attachment_setting.select { |setting| setting['force'] }.pluck('attachment_id')
      return false if ((required_attachment_ids | attachment_ids) - uploaded_attachment_ids).present?
      delete_attachment_ids = uploaded_attachment_ids - attachment_ids
      delete_attachments(delete_attachment_ids) if delete_attachment_ids.present? && delete_redundancy
      true
    end

    def viewable_attachments(include_self_attachment: false)
      return source.stage_attachment_files if actor_id == source.owner_id
      viewable_attachment_ids = viewable_in_processing_attachment_labels
      viewable_attachment_ids += self_attachment_labels if include_self_attachment
      ServiceFile.uploaded.where(label: viewable_attachment_ids)
    end

    private

    def delete_attachments(delete_attachment_ids)
      service_files.where(label: delete_attachment_ids).destroy_all
    end

    def viewable_in_processing_attachment_labels
      fetch_sign_stages.map do |sign_stage|
        sign_stage.stage_setting&.viewable_in_processing_attachments
      end&.flatten
    end

    def self_attachment_labels
      fetch_sign_stages.map do |sign_stage|
        sign_stage.attachment_setting.pluck('attachment_id')
      end&.flatten
    end

    def fetch_sign_stages
      return @sign_stages if @sign_stages.present?
      @sign_stages = source.is_a?(Envelope) ? SignStage.specific_sequence_in_envelope(source.id, sequence) : [self]
    end
  end
end
