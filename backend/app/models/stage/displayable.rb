class Stage
  module Displayable
    extend ActiveSupport::Concern

    def source_info
      {
        source_type: source_type,
        source_id: source_id,
        stage_type: self.class.base_class.name,
        stage_id: id
      }
    end

    def basic_info
      {
        stage_type: self.class.base_class.name,
        stage_id: id,
        actor_id: actor_id,
        stage_status: status
      }
    end

    def event_info
      stage_name = self.class.base_class.name
      {
        stage_id: id,
        stage_type: stage_name,
        actor_id: actor_id,
        stage_status: status,
        event_target: stage_name
      }
    end

    def actor_display_email
      actor_email = actor_info['email'].presence || email
      Settings.system_members.values.include?(actor_email) ? '' : actor_email
    end

    def display(member_id, with_xfdf: false)
      case source_type
      when 'SignTask'
        display_for_task(member_id, with_xfdf: with_xfdf)
      when 'Template'
        display_for_template(with_xfdf: with_xfdf)
      when 'Envelope'
        display_for_envelope(member_id)
      end
    end

    def xfdf_content
      return if action_review?
      content = xfdf_document&.content
      return content if content.present?
      exporter = KmpdfTool::XfdfExporter.call('SignTask', sign_task_id, id)
      raise exporter.error if exporter.failed?
      exporter.result[id]
    end

    def actor_info_ready?
      requisite = stage_setting&.requisite
      return true if requisite.blank?
      need_types = requisite.select { |type, status| status == 'required' }.keys
      ready_types = actor_info.select { |type, value| value.present? }.keys
      (need_types - ready_types).blank?
    end

    def sign_url(will_expired: false)
      jwt_token = self.sign_task.original_file&.preview_code(self, will_expired: will_expired)
      return nil if jwt_token.blank?
      lang_path = self.sign_task.setting_info["receiver_lang"] || 'en'
      "#{Settings.branch_deep_link.web}/#{lang_path}/task?code=#{jwt_token}"
    end

    private

    def display_for_task(member_id, with_xfdf: false)
      display_name = (actor_id == member_id) ? 'Me' : actor_display_name

      content = {
        task_id: source_id,
        stage_type: self.class.base_class.name,
        stage_id: id,
        name: display_name,
        sequence: sequence,
        custom_message_setting: custom_message_setting,
        email: email,
        action: action,
        action_type: status,
        pdf_object_info: pdf_object_info,
        icon_url: actor&.icon_url || Profile.default_icon_url,
        attachment_setting: self.is_a?(SignStage) ? attachment_setting_with_thumbnail : attachment_setting,
        attachment_count: attachments.length,
        field_settings: field_settings.map(&:display_info),
        field_setting_groups: field_setting_groups.map(&:display_info),
        stage_setting: stage_setting&.display_info || Settings.default.stage_setting,
        actor_info: actor_info
      }
      content[:need_otp_verify] = need_otp_verify?
      content[:verify_methods] = verify_methods.map(&:display) if need_otp_verify?
      content[:xfdf_text] = xfdf_content if with_xfdf
      content
    end

    def display_for_template(with_xfdf: false)
      info = {
        stage_id: id,
        role: actor_info['role'],
        sequence: sequence,
        action: action,
        attachment_setting: attachment_setting,
        attachment_count: attachment_setting&.length || 0,
        field_settings: field_settings.map(&:display_info),
        field_setting_groups: field_setting_groups.map(&:display_info),
        pdf_object_info: pdf_object_info,
        stage_setting: stage_setting&.display_info || Settings.default.stage_setting,
        actor_info: actor_info
      }
      info.merge!(xfdf_text: xfdf_document&.content) if with_xfdf
      info
    end

    def display_for_envelope(member_id)
      display_name = (actor_id == member_id) ? 'Me' : actor_display_name
      content = {
        envelope_id: source_id,
        stage_type: self.class.base_class.name,
        stage_id: id,
        name: display_name,
        sequence: sequence,
        email: email,
        action: action,
        action_type: status,
        icon_url: actor&.icon_url || Profile.default_icon_url,
        stage_setting: stage_setting&.display_info || Settings.default.stage_setting,
        actor_info: actor_info
      }
      content[:need_otp_verify] = need_otp_verify?
      content[:verify_methods] = verify_methods.map(&:display) if need_otp_verify?
      content
    end
  end
end
