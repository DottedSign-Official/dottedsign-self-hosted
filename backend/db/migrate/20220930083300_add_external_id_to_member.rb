class AddExternalIdToMember < ActiveRecord::Migration[6.1]
  def change
    add_column :members, :external_id, :string
  end
end
