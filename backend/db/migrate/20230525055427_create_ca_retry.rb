class CreateCaRetry < ActiveRecord::Migration[6.1]
  def change
    create_table :ca_retries do |t|
      t.integer "service_file_id", null: false
      t.integer "retry_count", default: 0
      t.string "error_message"
      t.integer "status", default: 0
      t.timestamps
    end
  end
end
