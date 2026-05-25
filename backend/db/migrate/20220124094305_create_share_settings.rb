class CreateShareSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :share_settings do |t|
      t.string :shared_type, null: false
      t.integer :shared_id, null: false
      t.string :target_type, null: false
      t.integer :target_id, null: false
      t.json :detail, default: {}

      t.timestamps
    end

    add_index :share_settings, [:shared_type, :shared_id]
    add_index :share_settings, [:target_type, :target_id]
  end
end
