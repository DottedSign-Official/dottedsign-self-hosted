FactoryBot.define do
  factory :stage_setting do
    forward_enable { true }
    decline_enable { true }
    viewable_in_processing { true }
    viewable_in_completed { true }

    after(:create) do |stage_setting|
      attachment_ids = stage_setting.stage.attachment_setting.map do |attachment_setting|
        attachment_setting['attachment_id']
      end.compact
      stage_setting.update(viewable_in_processing_attachments: attachment_ids)
    end
  end
end
