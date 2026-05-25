class AddPemToSystemCas < ActiveRecord::Migration[6.1]
  def change
    add_column :system_cas, :encrypted_pem, :text, null: false
  end
end
