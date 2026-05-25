class SignTask
  module Displayable
    extend ActiveSupport::Concern

    include TaskRelated::Displayable

    included do
      scope :with_display_content, -> { includes(:owner, :task_setting, :original_file, :completed_file, sign_stages: [:xfdf_document, :actor, :sign_task, :field_settings], dummy_stages: [:xfdf_document, :actor, :field_settings]) }
    end

    class_methods do

      def category_ids(task_ids, member_id)
        category_ids = {}
        category_ids[:waiting_for_me] = waiting_for_me_ids(task_ids, member_id)
        category_ids[:reissue_for_me] = SignStage.joins(:sign_task).processing_file_failed.where(sign_task_id: task_ids, actor_id: member_id).where.not(sign_tasks: { status: 'expired' }).pluck(:sign_task_id).uniq
        category_ids[:waiting_for_me_expire_soon] = SignTask.expire_soon.where(id: category_ids[:waiting_for_me]).pluck(:id).uniq
        category_ids[:waiting_for_others] = SignStage.joins(:sign_task).acting.where(sign_task_id: task_ids).where.not(actor_id: member_id).where.not(sign_tasks: { status: 'expired' }).pluck(:sign_task_id).uniq
        category_ids[:waiting_for_others_expire_soon] = SignTask.expire_soon.where(id: category_ids[:waiting_for_others]).pluck(:id).uniq
        category_ids[:completed] = SignTask.completed.where(id: task_ids).pluck(:id)
        category_ids[:canceled] = SignTask.cancel.where(id: task_ids).pluck(:id)
        category_ids[:draft] = SignTask.draft.where(id: task_ids, owner_id: member_id).where.not("start_from::jsonb? 'client'").ready.pluck(:id).uniq
        category_ids
      end

      def filter_ids(task_ids, member_id)
        return {} if task_ids.blank?
        {
          expire_soon: SignTask.expire_soon.where(id: task_ids).pluck(:id).uniq,
          expired: SignTask.where(id: task_ids).detect_and_setup_expired.pluck(:id).uniq
        }
      end

      def detect_and_setup_expired
        not_yet_setup = includes(:envelope).waiting.joins(:task_setting).where.not(task_settings: { deadline: nil }).where('task_settings.deadline < ?', Time.zone.now)
        Envelope.where(id: not_yet_setup.pluck(:envelope_id).compact.uniq).update(status: statuses[:expired])
        not_yet_setup.update(status: statuses[:expired])
        expired
      end

      private

      def waiting_for_me_ids(related_task_ids, member_id)
        # no envelope case
        task_ids = SignTask.joins(:sign_stages)
          .merge(SignStage.acting.where(actor_id: member_id))
          .where(id: related_task_ids, envelope_id: nil)
          .where.not(status: SignTask.statuses[:expired])
          .pluck(:id)

        # in envelope case
        task_ids += SignTask.joins(envelope: :dummy_stages)
          .merge(DummyStage.acting.where(actor_id: member_id))
          .where(id: related_task_ids)
          .where.not(status: SignTask.statuses[:expired])
          .pluck(:id)

        task_ids.uniq
      end

    end

    def display(member_id, with_xfdf: false, with_attachment: false, with_sign_url: false)
      with_sign_url = false unless Settings.default.sign_task.create_task.with_sign_url_enable
      stage_status = completed? ? 'done' : 'processing'
      current_stages = sign_stages.select { |stage| stage.status == stage_status }
      info = {
        task_id: id,
        file_name: file_name,
        sign_type: sign_type,
        has_order: has_order,
        created_at: created_at.to_i,
        modified_at: modified_at.to_i,
        status: status,
        current_stage_ids: current_stages.pluck(:id),
        task_owner_info: task_owner_info(member_id),
        stage_infos: stage_infos(member_id, with_xfdf: with_xfdf, with_sign_url: with_sign_url),
        current_member_turn: current_stages.pluck(:actor_id).include?(member_id),
        own_by_me: owner_id == member_id,
        thumbnail: thumbnail_info,
        decline_reasons: decline_reasons(member_id),
        tag_info: tag_info_for(member_id),
        access_info: access_info(Member.find_by_id(member_id)),
      }.merge(setting_info(member_id: member_id))
      info
    end

    def stage_infos(member_id, with_xfdf: false, with_sign_url: false)
      the_stages = with_xfdf ? stages.with_display_content : stages
      stage_infos = the_stages.map do |stage|
        stage_info = stage.display(member_id, with_xfdf: with_xfdf)
        stage_info[:sign_url] = stage.sign_url(will_expired: true) if with_sign_url
        stage_info
      end
      stage_infos.each { |info| info[:action_type] = nil } if draft?
      stage_infos
    end

    def related_emails
      emails = [owner.email] + sign_stages.pluck(:email)
      emails.compact.uniq.sort
    end

    def waiting_member_ids
      return unless waiting?
      sign_stages.processing.pluck(:actor_id)
    end

    def finished_member_emails
      member_emails = sign_stages.finished.pluck(:email)
      member_emails.compact.sort.uniq
    end

    def thumbnail_info
      {
        original: original_file&.download_link(attach_type: 'thumbnail'),
        completed: completed_file&.download_link(attach_type: 'thumbnail')
      }
    end

    def stages
      is_dummy? ? dummy_stages : sign_stages
    end

    def stage_class
      is_dummy? ? 'DummyStage' : 'SignStage'
    end

    def normal_stages
      is_dummy? ? dummy_stages.action_sign.display_order : sign_stages.where(action: ['sign', 'form_sign']).display_order
    end

    def preview_share_link(will_expired = true)
      link_code = preview_share_link_code(id, will_expired: will_expired)
      "#{Settings.branch_deep_link.web}#{Settings.preview_share_link_path}?code=#{link_code}"
    end

    def health_check_display
      info = {
        id: id,
        owner: owner.email,
        file_name: file_name,
        status: status,
        sign_type: sign_type,
        sign_stages_count: sign_stages.count,
        sign_has_order: has_order,
        sign_stage: sign_stages.with_health_check_content.map(&:health_check_display),
        sign_event: sign_events.map(&:health_check_display),
        created_at: created_at.to_i,
        bulk_mission_id: bulk_mission_id
      }.merge(related_file_size)
      self.in_envelope? ? info.merge({ envelope_id: envelope_id, envelope_name: envelope.envelope_name }) : info
    end

    def health_check_report
      checker = HealthCheck::SignTaskHealthCheck.call(self)
      checker.result if checker.success?
    end

    def form_token
      return unless form?
      next_form_stage = sign_stages.with_form_signer.still_no_action.first
      return if next_form_stage.nil?
      payload = {
        form_id: public_form_id,
        task_id: id,
        stage_id: next_form_stage.id,
        expired_at: 2.hours.after.to_i
      }
      JWT.encode(payload, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
    end

    def form_display_name
      return unless form?
      "#{public_form.form_name}-PublicForm-#{stages.first.actor_display_name}"
    end

    private

    def preview_share_link_code(task_id, will_expired: true)
      link_info = { task_id: task_id }
      link_info[:expired_at] = Time.zone.now.to_i + ServiceFile::PREVIEW_EXPIRED_IN if will_expired
      JWT.encode(link_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
    end

    def related_file_size
      file_size = {
        original_file_size: original_file&.file_size.to_i,
        completed_file_size: completed_file&.file_size.to_i,
      }
      file_size[:total_size] = file_size[:completed_file_size]
      file_size
    end

    def decline_reasons(member_id)
      member = Member.find_by(id: member_id)
      return Api::V1::DeclineReasonEntity.represent(DeclineReason.active_system_reserved) if member.group.nil?

      Api::V1::DeclineReasonEntity.represent(member.group.active_system_and_group_decline_reasons)
    end
  end
end
