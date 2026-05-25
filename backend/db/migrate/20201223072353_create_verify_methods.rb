class CreateVerifyMethods < ActiveRecord::Migration[6.1]
  def change
    create_table :verify_methods do |t|
      t.integer "sign_stage_id", null: false
      t.integer "sequence", null: false
      t.string "verify_type", null: false
      t.string "verify_source"
      t.string "uuid"
      t.integer "execute_type", default: 0
      t.integer "trigger_at"
      t.datetime "last_verify_at"

      t.timestamps
    end

    add_index :verify_methods, :uuid, unique: true
    add_index :verify_methods, :sign_stage_id
    add_index :verify_methods, [:sign_stage_id, :uuid], unique: true
    add_index :verify_methods, [:execute_type, :sign_stage_id, :sequence], unique: true, name: :verify_step_unique_index
  end
end
