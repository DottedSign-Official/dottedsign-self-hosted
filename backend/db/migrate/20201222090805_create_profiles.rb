class CreateProfiles < ActiveRecord::Migration[6.1]
  def change
    create_table :profiles do |t|
      t.integer :member_id, null: false, unique: true
      t.string :language, default: Settings.default.profile.language || 'en'
      t.string :full_name, default: ''
      t.string :first_name, default: ''
      t.string :telephone, default: ''
      t.string :nationality, default: ''
      t.string :address, default: ''
      t.string :organization, default: ''
      t.json :icon_url, default: {}

      t.timestamps
    end

    add_index :profiles, :member_id
  end
end
