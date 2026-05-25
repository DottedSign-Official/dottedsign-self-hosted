class CreateSignEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :sign_events do |t|
      t.integer "sign_task_id"
      t.integer "owner_id"
      t.string "task_type"
      t.string "task_status"
      t.string "stage_type"
      t.integer "stage_id"
      t.integer "signer_id"
      t.string "stage_status"
      t.string "file_name"
      t.string "event_target"
      t.string "action_name"
      t.integer "action_member_id"
      t.boolean "task_deleted", default: false, null: false
      t.boolean "task_expired", default: false, null: false
      t.string "ip_address"
      t.string "device"
      t.json "user_agent", default: {}
      t.json "other_info", default: {}

      t.timestamps
    end

    add_index :sign_events, [:sign_task_id, :owner_id]
    add_index :sign_events, [:stage_type, :stage_id, :signer_id]
    add_index :sign_events, :action_member_id
  end
end
