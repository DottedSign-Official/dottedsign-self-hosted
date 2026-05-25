class AddServiceFileDeletedAt < ActiveRecord::Migration[6.1]
  def change
    add_column :service_files, :deleted_at, :datetime
  end
end
