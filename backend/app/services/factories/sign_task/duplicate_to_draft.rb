module Factories
  module SignTask
    class DuplicateToDraft < ServiceCaller
      attr_reader :task

      def initialize(original_task, member, client_info)
        @original_task = original_task
        @member = member
        @client_info = client_info
        @original_task_id = @original_task.id
        @member_id = @member.id
        @attachment_id_map = {}
      end

      def call
        check_duplicable
        
        ActiveRecord::Base.transaction do
          duplicate_task
          duplicate_stages
          duplicate_task_setting
          duplicate_files
          record_create_event
        end

        @result = @task
      end

      private

      def check_duplicable
        raise ServiceError.new(:task_not_duplicable) unless @original_task.duplicable?
      end

      def duplicate_task
        @task = ::SignTask.create!(@original_task.attributes.slice('owner_id', 'file_name', 'has_order', 'file_info', 'position'))
      end

      def duplicate_stages
        last_base_stage_id = nil
        no_order_sequence = @original_task.sign_stages.length
        @original_task.sign_stages.order(:sequence).each do |original_stage|
          new_stage = original_stage.deep_dup
          new_stage.sign_task = @task
          new_stage.status = 'initial'
          new_stage.sequence = no_order_sequence unless @task.has_order
          if new_stage.action_form_sign?
            new_stage.action = 'sign'
            new_stage.actor_name = original_stage.actor_info['name']
            new_stage.email = original_stage.actor_info['email'].presence || original_stage.email
            new_stage.actor_info = {}
          end
          new_stage.actor_info['base_stage_id'] = last_base_stage_id if last_base_stage_id.present? && new_stage.action_review?
          new_stage.save!
          last_base_stage_id = new_stage.id if new_stage.action_sign?

          @attachment_id_map.merge!(new_stage.reset_attachment_ids!)
          duplicate_stage_dependencies(original_stage, new_stage)
        end
      end

      def duplicate_stage_dependencies(original_stage, new_stage)
        duplicate_xfdf_document_for(original_stage, new_stage)
        duplicate_field_setting_groups_for(original_stage, new_stage)
        duplicate_field_settings_for(original_stage, new_stage)
        duplicate_verify_methods_for(original_stage, new_stage)
        duplicate_stage_setting_for(original_stage, new_stage)
      end

      def duplicate_xfdf_document_for(original_stage, new_stage)
        return unless original_stage.xfdf_document.present?

        new_stage.create_xfdf_document(
          source: @task,
          content: original_stage.xfdf_document.content
        )
      end
      
      def duplicate_field_setting_groups_for(original_stage, new_stage)
        @field_setting_group_id_map = {}
        original_stage.field_setting_groups.each do |field_setting_group|
          new_field_setting_group = field_setting_group.deep_dup
          new_field_setting_group.source = @task
          new_field_setting_group.stage = new_stage
          new_field_setting_group.save!
          @field_setting_group_id_map[field_setting_group.id] = new_field_setting_group.id
        end
      end

      def duplicate_field_settings_for(original_stage, new_stage)
        original_stage.field_settings.each do |field_setting|
          new_field_setting = field_setting.deep_dup
          new_field_setting.source = @task
          new_field_setting.stage = new_stage
          new_field_setting.field_setting_group_id = @field_setting_group_id_map[field_setting.field_setting_group_id]
          new_field_setting.save!
        end
      end

      def duplicate_verify_methods_for(original_stage, new_stage)
        attributes_to_copy = ['verify_type', 'verify_source', 'sequence', 'occasion']
        original_stage.verify_methods.each do |verify_method|
          verify_attributes = verify_method.attributes.slice(*attributes_to_copy)
          new_stage.verify_methods.create!(verify_attributes)
        end
      end

      def duplicate_stage_setting_for(original_stage, new_stage)
        return unless original_stage.stage_setting.present?

        new_stage_setting = original_stage.stage_setting.deep_dup
        new_stage_setting.stage = new_stage
        new_stage_setting.viewable_in_processing_attachments.map! do |attachment_id|
          @attachment_id_map[attachment_id]
        end
        new_stage_setting.save!
      end

      def duplicate_task_setting
        return unless @original_task.task_setting.present?

        new_setting = @original_task.task_setting.deep_dup
        new_setting.deadline = nil
        new_setting.expire_remind_at = nil
        new_setting.sign_task = @task
        new_setting.save!
      end

      def duplicate_files
        original_file = @original_task.expired? ? @original_task.pristine_original_file : @original_task.original_file
        original_file.copy_to(@task, 'original', skip_callback: true)

        if @original_task.full_file.present?
          @original_task.full_file.copy_to(@task, 'full', skip_callback: true)
        end

        @original_task.reference_files.each do |reference_file|
          new_label = @attachment_id_map[reference_file.label] || reference_file.label
          reference_file.copy_to(@task, new_label, skip_callback: true)
        end

        @original_task.completed_reference_files.each do |completed_reference_file|
          completed_reference_file.copy_to(@task, completed_reference_file.label, skip_callback: true)
        end
      end

      def record_create_event
        @task.add_sign_event(:created, @member_id,
          client_info: @client_info,
          other_info: { duplicated_from: @original_task_id }
        )
      end
    end
  end
end 