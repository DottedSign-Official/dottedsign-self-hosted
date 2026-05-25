class CreateSignatures < ActiveRecord::Migration[6.1]
  def change
    create_table :signatures do |t|
      t.integer :member_id, null: false
      t.string :category, null: false
      t.string :file_type, null: false
      t.text :raw, null: false

      t.timestamps
    end
  end
end
