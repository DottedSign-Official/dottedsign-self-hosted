class UpdateSignTaskForEnvelope < ActiveRecord::Migration[6.1]
  def change
    add_reference :sign_tasks, :envelope, null: true
    add_column :sign_tasks, :file_info, :json, default: {}
    add_column :sign_tasks, :position, :integer, default: 1
  end
end
