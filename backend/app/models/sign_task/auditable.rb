class SignTask
  module Auditable
    extend ActiveSupport::Concern

    AVAILABLE_AUDIT_LANGS = %w[en zh-TW zh-CN ja].freeze

    def add_sign_event(action_name, action_member_id = nil, action_time: nil, stage_info:{}, client_info:{}, other_info:{})
      event_target = stage_info.blank? ? 'SignTask' : stage_info[:stage_type]
      other_info[:waiting_member_ids] ||= waiting_member_ids
      event_info = {
        owner_id: owner_id,
        file_name: file_name,
        task_type: sign_type,
        task_status: status,
        stage_type: stage_info[:stage_type],
        stage_id: stage_info[:stage_id],
        actor_id: stage_info[:actor_id],
        stage_status: stage_info[:stage_status],
        event_target: event_target,
        action_name: action_name,
        action_member_id: action_member_id,
        device: client_info[:client],
        ip_address: client_info[:ip_address],
        user_agent: {
          plain: client_info[:user_agent],
          display: SignEvent.parse_user_agent(client_info[:user_agent])
        },
        other_info: other_info
      }
      event_info[:created_at] = action_time if action_time.present?
      sign_events.create(event_info)
    end

    def audit_trails_pdf_info
      info = {
        profile: {
          task_title: file_name,
          document_id: long_id,
          sender: "#{owner.display_name} (#{owner.email})",
          completed_time: completed_at&.strftime('%m/%d/%Y %H:%M:%S %Z')
        },
        signers: stage_actors,
        cc_info: task_setting&.cc_info || [],
        activity_history: SignEvent.activity_history_for(id)
      }
      info[:envelope_info] = { envelope_title: envelope.envelope_name, envelope_id: envelope.long_id } if self.in_envelope?
      info
    end

    def audit_trails_pdf_download_info
      AuditTrailGenerateWorker.new.perform(id) if audit_trail_file.nil?
      audit_trail_file.download
    end

    def audit_trails_pdf_content
      if audit_trail_file.nil?
        AuditTrailGenerateWorker.new.perform(id)
      else
        audit_trail_file.file_content
      end
    end

    def stage_actors
      stages.map do |stage|
        {
          name: stage.actor_display_name,
          email: stage.actor_display_email
        }
      end
    end

  end
end
