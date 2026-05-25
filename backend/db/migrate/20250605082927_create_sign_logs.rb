class CreateSignLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :sign_logs do |t|
      t.string :source_type, null: false
      t.integer :source_id, null: false
      t.string :stage_type, null: false
      t.integer :stage_id, null: false
      t.integer :sign_event_id, null: false
      t.json :signed_fields, array: true, default: []
      t.json :signed_attachments, array: true, default: []

      t.timestamps

      t.index [:source_type, :source_id], name: 'index_sign_logs_on_source_type_and_source_id'
      t.index [:stage_type,  :stage_id],  name: 'index_sign_logs_on_stage_type_and_stage_id'
      t.index [:sign_event_id], name: 'index_sign_logs_on_sign_event_id'
    end
  end
end
