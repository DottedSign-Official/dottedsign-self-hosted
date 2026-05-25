class AddReviewedSkipConfirmToStageSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :stage_settings, :reviewed_skip_confirm, :boolean, default: true
  end
end
