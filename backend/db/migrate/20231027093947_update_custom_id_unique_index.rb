class UpdateCustomIdUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :field_settings, name: "index_field_settings_on_source_id_and_source_type_and_custom_id"

    # add unique index in scope of source and permit nil value
    add_index :field_settings, [:source_id, :source_type, :custom_id], unique: true, where: "(custom_id IS NOT NULL AND custom_id != '')"
  end
end
