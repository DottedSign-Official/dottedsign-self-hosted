class AddMessageToDeclineLogs < ActiveRecord::Migration[6.1]
  def change
    add_column :decline_logs, :message, :string
  end
end
