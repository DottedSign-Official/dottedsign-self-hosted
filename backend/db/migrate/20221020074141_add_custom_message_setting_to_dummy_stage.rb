class AddCustomMessageSettingToDummyStage < ActiveRecord::Migration[6.1]
  def change
    add_column :dummy_stages, :custom_message_setting, :json, default: {}
  end
end
