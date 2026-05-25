class CreateSystemCaAccessRights < ActiveRecord::Migration[6.1]
  def change
    create_table :system_ca_access_rights do |t|
      t.references :system_ca, null: false, foreign_key: true
      t.belongs_to :accessor, null:false, polymorphic: true

      t.timestamps
    end
  end
end
