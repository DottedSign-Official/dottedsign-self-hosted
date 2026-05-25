class AddTaskCallback < ActiveRecord::Migration[6.1]
  def change
    create_table :task_callbacks do |t|
      t.integer :sign_task_id, null: false
      t.integer :event, default: 0, null: false
      t.integer :status, default: 0, null: false
      t.timestamps
    end

    add_index :task_callbacks, :sign_task_id
  end
end
