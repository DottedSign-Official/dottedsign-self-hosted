class CreateSignStages < ActiveRecord::Migration[6.1]
  def change
    create_table :sign_stages do |t|
      t.integer "sign_task_id"
      t.integer "sequence"
      t.string "email", null: false
      t.integer "signer_id", null: false
      t.string "signer_name"
      t.json "pdf_object_info"
      t.integer "status", default: 0
      t.datetime "processing_from"
      t.json "attachment_setting", default: []

      t.timestamps
    end

    add_index :sign_stages, :sign_task_id
    add_index :sign_stages, :signer_id
  end
end
