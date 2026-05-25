module TaskRelated::Info::SignTask
  extend ActiveSupport::Concern
  include TaskRelated::Info::Base

  def owner_info
    return {} unless owner

    {
      email: owner.email,
      name: owner.display_name,
      lang: owner.i18n_locale
    }
  end

  def task_name
    file_name
  end

  def stages_for_notification(sign_stage_ids)
    SignStage.includes(:actor).where(id: sign_stage_ids)
  end
end
