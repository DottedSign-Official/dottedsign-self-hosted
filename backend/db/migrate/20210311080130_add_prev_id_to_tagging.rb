class AddPrevIdToTagging < ActiveRecord::Migration[6.1]
  def change
    add_column :taggings, :prev_id, :integer
  end
end
