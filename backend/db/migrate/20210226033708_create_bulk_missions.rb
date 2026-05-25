class CreateBulkMissions < ActiveRecord::Migration[6.1]
  def change
    create_table :bulk_missions do |t|
      t.string :uuid, null: false
      t.integer :template_id, null: false
      t.integer :owner_id, null: false
      t.integer :count, default: 0
      t.integer :status, default: 0
      t.json :client_info, default: {}
      t.json :setting_info, default: {}

      t.timestamps
    end

    add_index :bulk_missions, :uuid

    add_column :sign_tasks, :bulk_mission_id, :integer
  end
end
