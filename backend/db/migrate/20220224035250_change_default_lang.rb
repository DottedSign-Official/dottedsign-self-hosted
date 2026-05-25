class ChangeDefaultLang < ActiveRecord::Migration[6.1]
  def change
    change_column_default :profiles, :language, Settings.default.profile.language || 'en'
    change_column_default :task_settings, :receiver_lang, Settings.default.preference.receiver_lang || 'en'
  end
end
