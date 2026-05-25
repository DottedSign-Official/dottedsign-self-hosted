class Stage
  module Callbackable
    extend ActiveSupport::Concern

    def callback_params
      params = {
        task_id: sign_task_id,
        email: email,
        name: actor_display_name,
        action: action,
        preview_share_link: source.preview_share_link,
        next_infos: []
      }
      next_sequence = source.stages.processing.where("sequence > ?", sequence).minimum(:sequence)
      next_stages = source.stages.processing.where(sequence: next_sequence)
      return params if next_stages.blank?
      next_stages.each do |next_stage|
        preview_code = source.original_file.preview_code(next_stage, will_expired: true)
        params[:next_infos] << {
          email: next_stage.email,
          name: next_stage.actor_display_name,
          action: next_stage.action,
          share_link: "#{Settings.branch_deep_link.web}/task?code=#{preview_code}"
        }
      end
      params
    end
  end
end
