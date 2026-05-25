class UpdateIndexInVerifyMethods < ActiveRecord::Migration[6.1]
  def change
    remove_index :verify_methods, name: :verify_step_unique_index

    add_index :verify_methods, [:execute_type, :sign_stage_id, :verify_type, :sequence], unique: true, name: :verify_step_unique_index
  end
end
