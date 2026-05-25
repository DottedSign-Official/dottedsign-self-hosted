class CreateGroupDeclineReasons < ActiveRecord::Migration[6.1]
  def change
    create_table :group_decline_reasons do |t|
      t.references :group, null: false, foreign_key: true
      t.references :decline_reason, null: false, foreign_key: true

      t.timestamps
    end
  end
end
