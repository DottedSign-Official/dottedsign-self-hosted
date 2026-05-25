class CreateCombinations < ActiveRecord::Migration[6.1]
  def change
    create_table :combinations do |t|
      t.string :name
      t.integer :owner_id
      t.integer :group_id
      t.integer :quantity
      t.string :description
      t.boolean :has_order, default: false

      t.timestamps
    end

    add_index :combinations, :owner_id
  end
end
