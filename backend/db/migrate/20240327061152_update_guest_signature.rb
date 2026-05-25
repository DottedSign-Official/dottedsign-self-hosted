class UpdateGuestSignature < ActiveRecord::Migration[6.1]
  def change
    change_column_null :guest_signatures, :raw, true
  end
end
