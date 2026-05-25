class XfdfDocument < ApplicationRecord
  belongs_to :source, polymorphic: true
  belongs_to :stage, polymorphic: true

  after_commit :insert_sign_info, on: :create, if: Proc.new{|xfdf_doc| xfdf_doc.source_type == 'SignTask' && xfdf_doc.stage_type == 'DummyStage'}

  def self.create_from_xfdf_file(xfdf_info, xfdf_file_path)
    xfdf_doc = XfdfDocument.find_or_initialize_by(xfdf_info)
    xfdf_doc.content = File.read(xfdf_file_path)
    xfdf_doc if xfdf_doc.save
  end

  def clear_content
    self.content = nil
    self.save!
  end

  private

  def insert_sign_info
    signature_info = RedisAssistant.read_and_retry("signtask:#{source_id}:dummystage:#{stage_id}:sign_info").as_json
    return if signature_info.blank?

    stage.processing!
    DummySignWorker.perform_async(source_id, stage_id, signature_info)
  end
end
