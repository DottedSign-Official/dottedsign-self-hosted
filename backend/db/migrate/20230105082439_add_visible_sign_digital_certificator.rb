class AddVisibleSignDigitalCertificator < ActiveRecord::Migration[6.1]
  def change
    add_column :stage_settings, :is_visible_ca, :boolean, default: false
    add_column :stage_settings, :visible_ca_type, :string, array: true, default: []
  end
end
