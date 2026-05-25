class AddOtherInfoToSignature < ActiveRecord::Migration[6.1]
  def change
    add_column :signatures, :other_info, :jsonb, default: {}
    remove_column :signatures, :raw
    remove_column :guest_signatures, :raw
  end
end
