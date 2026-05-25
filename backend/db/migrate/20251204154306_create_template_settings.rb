class CreateTemplateSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :template_settings do |t|
      t.references :template, null: false
      t.boolean :forget_remind, default: false
      t.datetime :deadline
      t.datetime :expire_remind_at
      t.text :message
      t.text :completed_message
      t.boolean :need_otp_verify, default: false
      t.boolean :inform_enable, default: true
      t.string :receiver_lang, default: "zh-TW"
      t.json :cc_info, default: []
      t.json :reference_setting, default: []
      t.json :completed_reference_setting, default: []
      t.boolean :need_ca, default: false

      t.timestamps
    end
  end
end
