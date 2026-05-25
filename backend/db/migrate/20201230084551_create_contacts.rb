class CreateContacts < ActiveRecord::Migration[6.1]
  def change
    create_table :contacts do |t|
      t.integer :member_id, null: false
      t.string :email, null: false
      t.string :name
      t.string :phone

      t.timestamps
    end

    add_index :contacts, :member_id
    add_index :contacts, [:member_id, :email]
  end
end
