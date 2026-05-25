class AddCategoryAndOtherInfoToGuestSignature < ActiveRecord::Migration[6.1]
  def change
    add_column :guest_signatures, :other_info, :jsonb, default: {}
    add_column :guest_signatures, :category, :string, default: 'signature'

    add_index :signatures, :category
    add_index :guest_signatures, :category
    add_index :guest_signatures, :other_info, using: :gin, opclass: :jsonb_path_ops
  end
end
