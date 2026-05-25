class RenameEncryptedPemInSystemCa < ActiveRecord::Migration[6.1]
  def change
    rename_column :system_cas, :encrypted_pem, :pem
  end
end
