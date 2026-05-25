class AddFieldToStageSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :stage_settings, :decline_enable, :boolean, default: false
    add_column :stage_settings, :informable, :boolean, default: false
  end
end
