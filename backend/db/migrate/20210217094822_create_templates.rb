class CreateTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :templates do |t|
      t.string :file_name
      t.integer :owner_id
      t.integer :status, default: 0
      t.boolean :has_order, default: true

      t.timestamps
    end

    add_index :templates, :owner_id
  end
end
