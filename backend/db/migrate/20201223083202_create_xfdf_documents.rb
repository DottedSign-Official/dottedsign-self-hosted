class CreateXfdfDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :xfdf_documents do |t|
      t.string "source_type"
      t.integer "source_id"
      t.string "stage_type"
      t.integer "stage_id"
      t.text "content"

      t.timestamps
    end

    add_index :xfdf_documents, [:source_type, :source_id]
    add_index :xfdf_documents, [:stage_type, :stage_id]
  end
end
