class UpdateSignature < ActiveRecord::Migration[6.1]
  def change
    change_column_null :signatures, :raw, true
  end
end
