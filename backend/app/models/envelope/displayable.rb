class Envelope
  module Displayable
    extend ActiveSupport::Concern

    include TaskRelated::Displayable

    included do
      scope :with_display_content, -> { includes(:owner, :envelope_setting, dummy_stages: [:actor, :source, :field_settings]) }
    end

    def display(member_id, with_xfdf: false, with_task_infos: false)
      stage_action = completed? ? 'done' : 'acting'
      current_stages = dummy_stages.select { |stage| stage.send("#{stage_action}?") }
      info = {
        envelope_id: id,
        envelope_name: envelope_name,
        sign_type: sign_type,
        has_order: has_order,
        created_at: created_at.to_i,
        modified_at: modified_at.to_i,
        status: status,
        current_stage_ids: current_stages.pluck(:id),
        current_member_turn: current_stages.pluck(:actor_id).flatten.include?(member_id),
        task_owner_info: task_owner_info(member_id),
        stage_infos: stage_infos(member_id, with_xfdf: with_xfdf, with_task_infos: with_task_infos),
        own_by_me: owner_id == member_id,
        thumbnail: thumbnail_info,
        tag_info: tag_info_for(member_id),
        access_info: access_info(Member.find_by_id(member_id)),
      }.merge(setting_info(member_id: member_id))
      info[:task_infos] = task_infos if with_task_infos
      info
    end

    def stage_infos(member_id, with_xfdf: false, with_task_infos: false)
      stage_infos = dummy_stages.map { |stage| stage.display(member_id) }
      stage_infos.each { |info| info[:action_type] = nil } if draft?
      return stage_infos unless with_task_infos

      # Get the field / attachment information of the same sequence stage in all tasks
      task_stages_by_sequence = group_task_stages_by_sequence(with_xfdf: with_xfdf)
      stage_infos.each do |stage_info|
        stage_info[:envelope_task_infos] = task_stages_by_sequence[stage_info[:sequence]] || []
      end
      stage_infos
    end

    def group_task_stages_by_sequence(with_xfdf: false)
      sign_tasks.each_with_object({}) do |task, hash|
        the_stages = with_xfdf ? task.stages.with_display_content : task.stages
        the_stages.each do |stage|
          envelope_task_info = {
            task_id: task.id,
            pdf_object_info: stage.pdf_object_info,
            field_settings: stage.field_settings.map(&:display_info),
            field_setting_groups: stage.field_setting_groups.map(&:display_info),
            attachment_setting: stage.attachment_setting,
            attachment_count: stage.attachments.length,
            xfdf_text: with_xfdf ? stage.xfdf_content : nil
          }
          hash[stage.sequence] ||= []
          hash[stage.sequence] << envelope_task_info
        end
      end
    end

    def task_infos
      sign_tasks.order(:position).map do |task|
        {
          task_id: task.id,
          file_name: task.file_name,
          download_link: task.download_link_for('original'),
          file_info: task.file_info
        }
      end
    end

    def related_emails
      emails = [owner.email] + dummy_stages.flat_map(&:email)
      emails.compact.uniq.sort
    end

    def finished_member_emails
      member_emails = dummy_stages.finished.flat_map(&:email)
      member_emails.compact.sort.uniq
    end

    def first_task
      @first_task ||= sign_tasks.find_by(position: 1)
    end

    def stages
      dummy_stages
    end

    def sign_stages
      first_task&.stages || []
    end

    def decline_log
      first_task&.decline_log
    end

    def thumbnail_info
      {
        original: first_task&.original_file&.download_link(attach_type: 'thumbnail'),
        completed: first_task&.completed_file&.download_link(attach_type: 'thumbnail')
      }
    end

    def preview_share_link(will_expired = true)
      link_code = preview_share_link_code(id, will_expired: will_expired)
      "#{Settings.branch_deep_link.web}#{Settings.preview_share_link_path}?code=#{link_code}"
    end

    private

    def preview_share_link_code(envelope_id, will_expired: true)
      link_info = { envelope_id: envelope_id }
      link_info[:expired_at] = Time.zone.now.to_i + ServiceFile::PREVIEW_EXPIRED_IN if will_expired
      JWT.encode(link_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
    end
  end
end
