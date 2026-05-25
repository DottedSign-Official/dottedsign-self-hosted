class CreateTaskSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :task_settings do |t|
      t.integer "sign_task_id", null: false
      t.boolean "forget_remind", default: false
      t.datetime "deadline"
      t.datetime "expire_remind_at"
      t.text "message"
      t.boolean "need_otp_verify", default: false
      t.boolean "inform_enable", default: true
      t.string "receiver_lang", default: Settings.default.preference.receiver_lang || 'en'
      t.json "cc_info", default: []
      t.json "reference_setting", default: []

      t.timestamps
    end

    add_index :task_settings, :sign_task_id, unique: true
  end
end
