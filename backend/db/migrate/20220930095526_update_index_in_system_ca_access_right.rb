class UpdateIndexInSystemCaAccessRight < ActiveRecord::Migration[6.1]
  def change
    remove_index :system_ca_access_rights, name: :index_system_ca_access_rights_on_accessor

    add_index :system_ca_access_rights, [:accessor_type, :accessor_id], unique: true, name: :index_system_ca_access_rights_on_accessor
  end
end
