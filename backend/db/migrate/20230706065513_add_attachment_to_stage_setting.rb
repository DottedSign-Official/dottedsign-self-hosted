class AddAttachmentToStageSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :stage_settings, :viewable_in_completed, :boolean, default: true
    add_column :stage_settings, :viewable_in_processing, :boolean, default: false
    add_column :stage_settings, :viewable_in_processing_attachments, :string, array: true, default: []
  end
end
