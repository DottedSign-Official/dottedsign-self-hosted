class AddGroupToSystemCa < ActiveRecord::Migration[6.1]
  def change
    add_reference :system_cas, :group, null: false, foreign_key: true
  end
end
