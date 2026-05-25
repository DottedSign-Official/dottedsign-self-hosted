class CreateFieldSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :field_settings do |t|
      t.string "source_type"
      t.integer "source_id"
      t.string "stage_type"
      t.integer "stage_id"
      t.string "field_object_id"
      t.string "field_type"
      t.json "field_value"
      t.float "coord", default: [], array: true
      t.integer "page"
      t.json "options", default: {}

      t.timestamps
    end

    add_index :field_settings, [:source_type, :source_id]
    add_index :field_settings, [:stage_type, :stage_id]
  end
end
