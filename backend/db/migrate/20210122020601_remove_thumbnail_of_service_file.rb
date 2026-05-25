class RemoveThumbnailOfServiceFile < ActiveRecord::Migration[6.1]
  def change
    remove_column :service_files, :thumbnail
  end
end
