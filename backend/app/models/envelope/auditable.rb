class Envelope
  module Auditable
    extend ActiveSupport::Concern

    AVAILABLE_AUDIT_LANGS = %w[en zh-TW zh-CN ja].freeze

    def add_sign_event(action_name, action_member_id = nil, action_time: nil, stage_info: {}, client_info: {}, other_info: {})
      event_target = stage_info.blank? ? 'Envelope' : stage_info[:stage_type]
      other_info[:waiting_member_ids] ||= waiting_member_ids
      event_info = {
        owner_id: owner_id,
        file_name: envelope_name,
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

    def audit_trails_pdf_download_info
      sign_tasks.each do |task|
        AuditTrailGenerateWorker.new.perform(task.id) if task.audit_trail_file.nil?
      end
      audit_trail_file.download
    end

    private

    def waiting_member_ids
      return unless waiting?
      processing_stages.pluck(:actor_id)
    end
  end
end
