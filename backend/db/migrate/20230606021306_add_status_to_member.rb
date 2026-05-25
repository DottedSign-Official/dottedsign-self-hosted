class AddStatusToMember < ActiveRecord::Migration[6.1]
  def change
    add_column :members, :status, :integer, default: 0
  end
end
