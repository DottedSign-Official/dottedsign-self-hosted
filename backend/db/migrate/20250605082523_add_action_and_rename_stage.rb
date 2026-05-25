class AddActionAndRenameStage < ActiveRecord::Migration[6.1]
  def change
    add_column :sign_stages, :action, :string, default: 'sign'
    add_column :sign_stages, :actor_info, :jsonb, default: {}
    rename_column :sign_stages, :signer_id, :actor_id
    rename_column :sign_stages, :signer_name, :actor_name

    remove_index :sign_stages, :signer_id if index_exists?(:sign_stages, :signer_id)
    add_index :sign_stages, :actor_id unless index_exists?(:sign_stages, :actor_id)

    add_column :dummy_stages, :action, :string, default: 'sign'
    rename_column :dummy_stages, :signer_info, :actor_info
    rename_column :dummy_stages, :signer_id, :actor_id

    rename_column :sign_events, :signer_id, :actor_id
  end
end
