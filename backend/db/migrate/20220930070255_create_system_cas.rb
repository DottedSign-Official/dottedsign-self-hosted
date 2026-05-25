class CreateSystemCas < ActiveRecord::Migration[6.1]
  def change
    create_table :system_cas do |t|
      t.string :cluster_id, null: false
      t.string :token, null: false
      t.string :email, null: false

      t.timestamps
    end
  end
end
