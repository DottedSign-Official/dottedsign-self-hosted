class CreateSignTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :sign_tasks do |t|
      t.string :long_id, null: false, unique: true
      t.integer :owner_id
      t.string :file_name
      t.boolean :has_order, default: true
      t.integer :status, default: 0
      t.datetime :modified_at, null: false
      t.datetime :completed_at
      t.json :start_from, default: {}, null: false
      t.integer :sign_type, default: 0

      t.timestamps
    end

    add_index :sign_tasks, :long_id
    add_index :sign_tasks, :owner_id
  end
end
