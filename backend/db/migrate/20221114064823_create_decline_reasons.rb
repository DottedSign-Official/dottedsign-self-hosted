class CreateDeclineReasons < ActiveRecord::Migration[6.1]
  def change
    create_table :decline_reasons do |t|
      t.integer :status, default: 0
      t.boolean :system_reserved, default: false
      t.string :content

      t.timestamps
    end

    add_column :decline_logs, :decline_reason_id, :integer
  end
end
