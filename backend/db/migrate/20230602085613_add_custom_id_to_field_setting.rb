class AddCustomIdToFieldSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :field_settings, :custom_id, :string

    # add unique index in scope of source and permit nil value
    add_index :field_settings, [:source_id, :source_type, :custom_id], unique: true, where: 'custom_id IS NOT NULL'
  end
end