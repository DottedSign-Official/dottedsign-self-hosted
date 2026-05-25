class CreateEnvelopes < ActiveRecord::Migration[6.1]
  def change
    create_table :envelopes do |t|
      t.string :long_id, null: false
      t.integer :owner_id
      t.string :envelope_name
      t.boolean :has_order, default: true
      t.integer :status, default: 0
      t.datetime :modified_at, null: false
      t.datetime :completed_at
      t.json :start_from, default: {}, null: false
      t.integer :sign_type, default: 0
      t.integer :group_id

      t.timestamps
    end

    add_index :envelopes, :long_id, unique: true
    add_index :envelopes, :owner_id
  end
end
