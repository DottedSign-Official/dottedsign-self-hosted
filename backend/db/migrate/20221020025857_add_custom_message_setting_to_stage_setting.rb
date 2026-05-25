class AddCustomMessageSettingToStageSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :sign_stages, :custom_message_setting, :json, default: { processing_viewable: false, completed_viewable: false }

    SignStage.all.each do |stage|
      task = stage.sign_task
      task_setting = task.task_setting
      next if task_setting.nil?

      task_setting.completed_message = task_setting.message if task_setting.message.present?

      stage.custom_message_setting = if stage.signer_id == task.owner_id
                                       stage.custom_message_setting = {
                                         processing_viewable: true,
                                         completed_viewable: true
                                       }
                                     elsif task_setting.message.nil? && task_setting.reference_setting.blank?
                                       stage.custom_message_setting = {
                                         processing_viewable: false,
                                         completed_viewable: false
                                       }
                                     else
                                       stage.custom_message_setting = {
                                         processing_viewable: true,
                                         completed_viewable: false
                                       }
                                     end

      task_setting.save!
      stage.save!
    end
  end
end
