class CreatePublicForms < ActiveRecord::Migration[6.1]
  def change
    create_table :public_forms do |t|
      t.string :uuid, null: false
      t.integer :owner_id, null: false
      t.references :template, null: false, foreign_key: true
      t.string :form_name
      t.text :description
      t.integer :sent_num, default: 0
      t.integer :goal_num
      t.datetime :end_at
      t.json :signer_infos
      t.integer :status, default: 0
      t.boolean :is_deleted, default: false
      t.datetime :publish_at
      t.integer :group_id

      t.timestamps
    end

    add_index :public_forms, :uuid, unique: true
    add_index :public_forms, :owner_id
    add_index :public_forms, :group_id

    add_column :sign_tasks, :public_form_id, :integer, null: true
    add_column :templates, :usage, :integer, default: 0, null: false
  end
end
