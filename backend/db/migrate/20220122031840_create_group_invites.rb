class CreateGroupInvites < ActiveRecord::Migration[6.1]
  def change
    create_table :group_invites do |t|
      t.integer :group_id, null: false
      t.integer :member_id, null: false
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
