class CreateCountryInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :country_infos do |t|
      t.string :name
      t.string :alpha2
      t.string :alpha3
      t.string :calling_code
      t.json :translations, default: {}

      t.timestamps
    end
  end
end
