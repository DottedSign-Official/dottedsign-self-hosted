class CreateServiceFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :service_files do |t|
      t.string "storable_type", null: false
      t.integer "storable_id", null: false
      t.string "label"
      t.json "thumbnail", default: {}
      t.datetime "uploaded_at"

      t.timestamps
    end

    add_index :service_files, [:storable_type, :storable_id]
  end
end
