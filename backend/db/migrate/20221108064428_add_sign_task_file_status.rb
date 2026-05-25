class AddSignTaskFileStatus < ActiveRecord::Migration[6.1]
  def change
    add_column :sign_tasks, :file_status, :integer, default: 0
  end
end
