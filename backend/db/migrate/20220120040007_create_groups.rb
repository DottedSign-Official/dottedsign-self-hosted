class CreateGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :groups do |t|
      t.string :name
      t.string :unique_name, null: false
      t.integer :status, default: 0
      t.json :icon_url

      t.timestamps
    end

    add_column :members, :group_id, :integer
    add_column :sign_tasks, :group_id, :integer
    add_column :sign_stages, :group_id, :integer
    add_column :templates, :group_id, :integer
  end
end
