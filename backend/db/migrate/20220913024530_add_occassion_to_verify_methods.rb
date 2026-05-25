class AddOccassionToVerifyMethods < ActiveRecord::Migration[6.1]
  def change
    add_column :verify_methods, :occassion, :string, default: 'sign'
  end
end
