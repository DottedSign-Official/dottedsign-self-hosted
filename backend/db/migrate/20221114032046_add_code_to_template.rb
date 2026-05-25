class AddCodeToTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column :templates, :code, :string

    add_index :templates, :code
  end
end
