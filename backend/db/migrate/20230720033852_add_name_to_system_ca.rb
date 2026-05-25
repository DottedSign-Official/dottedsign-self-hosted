class AddNameToSystemCa < ActiveRecord::Migration[6.1]
  def change
    add_column :system_cas, :name, :string
  end
end
