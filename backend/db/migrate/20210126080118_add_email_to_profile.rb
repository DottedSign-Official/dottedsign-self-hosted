class AddEmailToProfile < ActiveRecord::Migration[6.1]
  def change
    add_column :profiles, :email, :string
  end
end
