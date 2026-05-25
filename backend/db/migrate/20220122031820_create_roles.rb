class CreateRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :roles do |t|
      t.string :name
      t.integer :group_id, null: false
      t.json :permission, default: {}
      t.integer :priority, null: false

      t.timestamps
    end
  end
end
