class SignEvent < ApplicationRecord
  self.inheritance_column = :action_name

  belongs_to :envelope, optional: true
  belongs_to :sign_task, optional: true
  belongs_to :owner, class_name: 'Member', foreign_key: :owner_id
  belongs_to :actor, class_name: 'Member', foreign_key: :actor_id, optional: true
  belongs_to :action_member, class_name: 'Member', foreign_key: :action_member_id, optional: true
  belongs_to :stage, polymorphic: true, optional: true
  has_one :decline_log
  has_one :sign_log
  has_one :review_log

  scope :activity_history_actions, -> { where(action_name: ['created', 'sent', 'signed', 'verified', 'signer_changed', 'declined', 'ca_failed', 'reissue', 'review_passed', 'review_rejected']) }
  scope :with_display_content, -> { includes(:action_member, :sign_task, stage: [:actor]) }
  scope :modified_action, -> { where(action_name: ['created', 'modified', 'sent', 'signed', 'signer_changed', 'declined']) }
  scope :canceled, -> { where(action_name: ['declined']).or(where(task_expired: true)) }

  ACTION_MODE_MAP = {
    'normal' => 'remote',
    'inperson' => 'in_person',
    'quick' => 'remote',
    'guest' => 'guest',
    'kiosk' => 'kiosk',
    'self' => 'self'
  }.freeze
  CLIENT_INFO = [:client, :ip_address, :user_agent].freeze
  SPECIAL_EVENT_MAP = {
    'signer_changed' => 'change_event'
  }.freeze

  class << self
    # built-in class method to bind subclass in STI before storing record
    def sti_name
      self.name.demodulize.underscore
    end

    # built-in class method to bind subclass in STI after finding record
    def sti_class_for(type_name)
      type_name = SPECIAL_EVENT_MAP[type_name].present? ? "SignEvents::#{SPECIAL_EVENT_MAP[type_name].camelize}" : 'SignEvent'
      super(type_name)
    end

    def timelines_for(member_id, page=1, per_page=PER_PAGE)
      events = activity_history_actions.recent.where(action_member_id: member_id).page(page).per(per_page)
      timelines = events.with_display_content.map{ |e| e.timeline_display(member_id) }.compact
      {
        timelines: timelines,
        current_page: events.current_page,
        total_pages: events.total_pages
      }
    end

    def audit_trail_for(source, member_id)
      return if source.nil? || source.related_member_ids.exclude?(member_id)
      audit_trail_info = activity_history_for(source.id, source.class.name)
      source.display(member_id).merge({ audit_trail: audit_trail_info })
    end

    def activity_history_for(source_id, source_type = 'SignTask')
      id_column = source_type == 'Envelope' ? 'envelope_id' : 'sign_task_id'
      events = activity_history_actions.recent.where(id_column => source_id).or(where(id: first_viewed_event_ids(id_column, source_id)))
      events.includes(:action_member).map{ |e| e.activity_history_display }.compact
    end

    def first_viewed_event_ids(id_column, source_id)
      events = select("#{id_column}, stage_id, actor_id, MIN(id) AS id")
              .where({ id_column => source_id, action_name: 'viewed' })
              .group(id_column, :stage_id, :actor_id)
      events.map(&:id)
    end

    def parse_user_agent(user_agent)
      return '' if user_agent.blank?
      agent = UserAgentParser.parse(user_agent)
      agent_info = {
        os: agent.os.to_s,
        device: agent.device.family
      }
      agent_info[:app] = agent_info[:device].nil? ? agent.family : 'DottedSign'
      [agent_info[:app], 'on', agent_info[:os], agent_info[:device]].compact.join(' ')
    end
  end

  def timeline_display(member_id)
    return if task_type == 'sign_and_send' && action_name == 'created'
    {
      created_at: created_at.to_i,
      file_status: file_status(member_id),
      action_name: action_name,
      role: role(member_id),
      file_name: file_name,
      sign_task_id: sign_task_id,
      task_deleted: task_deleted,
      task_expired: task_expired,
      thumbnail: sign_task.thumbnail_info
    }
  end

  def activity_history_display
    return if task_type == 'sign_and_send' && action_name == 'created'
    {
      event_date: created_at.strftime('%m/%d/%Y'),
      event_time: created_at.strftime('%H:%M:%S %Z'),
      action_name: I18n.t("audit_trail.action.#{action_type}"),
      role: active_history_role,
      ip_address: ip_address,
      device: user_agent['display'] || I18n.t("audit_trail.detail.device.#{device}"),
      sign_mode: action_mode.nil? ? '' : I18n.t("audit_trail.sign_mode.#{action_mode}"),
      tid: other_info['tid']
    }
  end

  def health_check_display
    {
      event_datetime: created_at.to_i,
      action_name: action_name,
      event_email: active_history_role,
      ip_address: ip_address,
      device: user_agent['plain'] || device
    }
  end

  def action_type
    if action_name == 'verified'
      "verified_via_#{verify_source}"
    elsif (action_name == 'signed' || action_name == 'viewed') && other_info['action_mode'] == 'quick'
      "quick_#{action_name}"
    else
      action_name
    end
  end

  def action_mode
    @action_mode ||= ACTION_MODE_MAP[other_info['action_mode']]
  end

  def set_as_stage_last_action
    self.other_info['stage_last_action'] = true
    self.save
  end

  private

  def role(member_id)
    case event_target
    when 'SignStage', 'SignTask'
      action_member_id == member_id ? 'Me' : action_member.display_name
    when 'DummyStage'
      task_type == 'sign_and_send' ? 'Me' : (stage.actor_info['name'] || stage.actor_info['email'])
    end
  end

  def active_history_role
    case event_target
    when 'SignTask', 'Envelope'
      action_member_history_role
    when 'SignStage'
      stage&.action_form_sign? ? actor_info_role : action_member_history_role
    when 'DummyStage'
      actor_info_role
    end
  end

  def action_member_history_role
    return 'system' if action_member.blank?
    action_member.email || action_member.display_name
  end

  def actor_info_role
    stage.actor_info['email'].presence || stage.actor_info['name']
  end

  def file_status(member_id)
    return task_status unless task_status == 'waiting'
    return 'canceled' if action_name == 'declined'
    return 'completed' if other_info['waiting_member_ids'].blank?
    other_info['waiting_member_ids'].include?(member_id) ? 'waiting_for_me' : 'waiting_for_others'
  end

  def verify_source
    return if other_info['verify_source'].blank?
    sources = other_info['verify_source'].except('tid').keys
    sources.length > 1 ? 'both' : sources.first.downcase
  end
end
