class CreateMemberRoles < ActiveRecord::Migration[6.1]
  def change
    create_table :member_roles do |t|
      t.integer :member_id, null: false
      t.integer :role_id, null: false

      t.timestamps
    end
  end
end
