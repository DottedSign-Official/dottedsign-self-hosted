class SignTask
  module GroupDisplayable
    extend ActiveSupport::Concern

    ALLOW_CATEGORIES = %w[reissue_for_me waiting_for_me waiting_for_others completed canceled draft].freeze
    ALLOW_FILTERS = %w[expire_soon expired].freeze

    class_methods do

      def group_category_ids(task_ids, group_id)
        category_ids = {}
        category_ids[:waiting_for_group] = SignStage.processing.where(sign_task_id: task_ids, group_id: group_id).pluck(:sign_task_id).uniq
        category_ids[:waiting_for_other_groups] = SignStage.processing.where(sign_task_id: task_ids).where("group_id is NULL or group_id != ?", group_id).pluck(:sign_task_id).uniq # where not group_id = [integer] will not get nil group_id records
        category_ids[:group_completed] = SignTask.completed.where(id: task_ids).pluck(:id)
        category_ids[:group_canceled] = SignTask.declined.where(id: task_ids).pluck(:id)
        category_ids[:group_draft] = SignTask.draft.where(id: task_ids, group_id: group_id).where.not("start_from::jsonb? 'client'").ready.pluck(:id).uniq
        category_ids[:processing_file_failed_for_group] = SignStage.processing_file_failed.where(sign_task_id: task_ids).pluck(:sign_task_id).uniq
        category_ids
      end

    end

  end
end
