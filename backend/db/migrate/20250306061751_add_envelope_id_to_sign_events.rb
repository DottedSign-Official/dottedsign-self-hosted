class AddEnvelopeIdToSignEvents < ActiveRecord::Migration[6.1]
  def change
    add_reference :sign_events, :envelope, null: true
  end
end
