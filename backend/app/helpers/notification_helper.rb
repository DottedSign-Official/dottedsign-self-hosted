module NotificationHelper
  module_function

  def from_stages(stages)
    return [] if stages.blank?

    source = if stages.first.source_type == 'Envelope'
             stages.first.source
           else
             stages.first.sign_task
           end

    stages.map do |stage|
      actor = stage.actor
      next unless actor.present?

      {
        email: stage.email,
        name: stage.actor_display_name,
        lang: source.mail_lang_for(actor, stage)
      }
    end
  end

  def from_members(members)
    return [] if members.blank?

    members.map do |member|
      {
        email: member.email,
        name: member.display_name,
        lang: member.i18n_locale
      }
    end
  end
end
