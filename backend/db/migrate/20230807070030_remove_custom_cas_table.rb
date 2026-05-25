class RemoveCustomCasTable < ActiveRecord::Migration[6.1]
  def change
    drop_table :custom_cas
  end
end
