class CreateCustomCas < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_cas do |t|
      t.string :source_type, null: false
      t.integer :source_id, null: false
      t.string :cert_type, null: false
      t.string :serial_num, default: ""
      t.integer :status, default: 0
      t.datetime :expired_at

      t.timestamps
    end

    add_index :custom_cas, [:source_type, :source_id]
    add_index :custom_cas, [:source_type, :source_id, :status]
  end
end
