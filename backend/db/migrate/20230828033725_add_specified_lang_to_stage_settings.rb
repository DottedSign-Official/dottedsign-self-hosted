class AddSpecifiedLangToStageSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :stage_settings, :specified_lang, :string
  end
end
