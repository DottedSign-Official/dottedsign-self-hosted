class ChangeLanguageDefaultValueToProfile < ActiveRecord::Migration[6.1]
  def change
    change_column_default :profiles, :language, "zh-TW"
  end
end
