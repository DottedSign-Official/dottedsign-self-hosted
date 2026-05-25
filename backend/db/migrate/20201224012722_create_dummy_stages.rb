class CreateDummyStages < ActiveRecord::Migration[6.1]
  def change
    create_table :dummy_stages do |t|
      t.string "source_type"
      t.integer "source_id"
      t.integer "sequence"
      t.integer "signer_id"
      t.json "signer_info", default: {}
      t.json "pdf_object_info"
      t.json "attachment_setting", default: []

      t.timestamps
    end

    add_index :dummy_stages, [:source_type, :source_id]
  end
end
