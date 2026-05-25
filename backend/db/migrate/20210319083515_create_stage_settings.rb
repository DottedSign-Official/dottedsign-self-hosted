class CreateStageSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :stage_settings do |t|
      t.string :stage_type, null: false
      t.integer :stage_id, null: false
      t.boolean :forward_enable, default: false

      t.timestamps
    end

    add_index :stage_settings, [:stage_type, :stage_id]
  end
end
