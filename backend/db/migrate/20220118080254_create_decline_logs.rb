class CreateDeclineLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :decline_logs do |t|
      t.integer :sign_task_id, null: false
      t.integer :sign_stage_id, null: false
      t.integer :sign_event_id, null: false
      t.string :reason
      t.json :reply_to

      t.timestamps
    end

    add_index :decline_logs, :sign_task_id
    add_index :decline_logs, :sign_stage_id
    add_index :decline_logs, :sign_event_id

    change_column_default :profiles, :icon_url, from: {}, to: nil
  end
end
