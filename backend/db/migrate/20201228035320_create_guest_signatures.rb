class CreateGuestSignatures < ActiveRecord::Migration[6.1]
  def change
    create_table :guest_signatures do |t|
      t.text :raw, null: false

      t.timestamps
    end
  end
end
