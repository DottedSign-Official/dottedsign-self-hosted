module TaskRelated::Info::Envelope
  extend ActiveSupport::Concern
  include TaskRelated::Info::Base

  def owner_info
    return {} unless owner.present?

    {
      email: owner.email,
      name: owner.display_name,
      lang: owner.i18n_locale
    }
  end

  def task_name
    envelope_name
  end

  def stages_for_notification(dummy_stage_ids)
    DummyStage.includes(:actor).where(id: dummy_stage_ids)
  end
end
