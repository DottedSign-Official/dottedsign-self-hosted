class RemoveVisibleCaOfStageSettings < ActiveRecord::Migration[6.1]
  def change
    remove_column :stage_settings, :visible_ca_type
    remove_column :stage_settings, :is_visible_ca
  end
end
