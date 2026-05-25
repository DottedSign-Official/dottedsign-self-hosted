class AddIndexToSignature < ActiveRecord::Migration[6.1]
  def change
    add_index :signatures, :other_info, using: :gin, opclass: :jsonb_path_ops
  end
end
