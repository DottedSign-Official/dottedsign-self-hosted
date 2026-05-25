class CreateFieldSettingGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :field_setting_groups do |t|
      t.string :source_type
      t.integer :source_id
      t.string :stage_type
      t.integer :stage_id
      t.string :field_group_type
      t.string :field_group_object_id
      t.json :options, default: {}

      t.timestamps
      t.index ["source_type", "source_id"], name: "index_field_setting_groups_on_source_type_and_source_id"
      t.index ["stage_type", "stage_id"], name: "index_field_setting_groups_on_stage_type_and_stage_id"
    end

    add_column :field_settings, :field_setting_group_id, :integer
    add_index :field_settings, :field_setting_group_id
  end
end
