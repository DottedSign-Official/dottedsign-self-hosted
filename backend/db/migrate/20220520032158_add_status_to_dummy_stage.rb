class AddStatusToDummyStage < ActiveRecord::Migration[6.1]
  def change
    add_column :dummy_stages, :status, :integer, default: 0
    add_column :stage_settings, :requisite, :json, default: {}
  end
end
