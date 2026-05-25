module TaskRelated::Displayable
  extend ActiveSupport::Concern

  include SettingDisplayable

  ALLOW_CATEGORIES = %w[reissue_for_me waiting_for_me waiting_for_others completed canceled draft].freeze
  ALLOW_FILTERS = %w[expire_soon expired].freeze

  class_methods do

    def display_infos(member_id)
      with_display_content.map do |source|
        source.display(member_id)
      end
    end

  end

  def task_owner_info(member_id)
    owner_name = (owner_id == member_id) ? 'Me' : owner.display_name
    {
      name: owner_name,
      sequence: 0,
      email: owner.email,
      action_type: draft? ? nil : :send,
      icon_url: owner.icon_url
    }
  end

  def cc_related_emails
    return [] if setting.blank?
    setting.cc_info&.pluck('email') || []
  end

  def related_mail_infos
    members = Member.where(email: related_emails).as_json(only: [:email], methods: [:display_name])
    members.pluck('email', 'display_name').to_h
  end

  def deliver_info
    {
      sender_name: owner.display_name,
      sender_email: owner.email,
      doc_name: file_name
    }
  end

  def receiver_lang
    setting&.receiver_lang || owner.receiver_lang
  end

  def finished?
    completed? || declined?
  end

  def last_modified_at
    return if modified_events.blank? && modified_at.blank?
    [modified_events[0]&.created_at.to_i, modified_at.to_i].max
  end

  def mail_lang_for(member, stage = nil)
    return member.i18n_locale if member.is_registered?
    stage&.stage_setting&.specified_lang || self&.receiver_lang || Settings.default.profile.language
  end

  def push_notify_info
    {
      event_user: owner.display_name,
      doc_name: file_name,
      share_link: preview_share_link
    }
  end
end
