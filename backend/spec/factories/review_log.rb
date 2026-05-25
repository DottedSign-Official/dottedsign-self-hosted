FactoryBot.define do
  factory :review_log do
    transient do
      pass { true }
    end

    before(:create) do |review_log, evaluator|
      stage = review_log.stage.sti_reload!
      review_log.reviewed_fields = stage.base_stage.field_settings.map { |field_setting| { field_object_id: field_setting.field_object_id, accepted: evaluator.pass } }
      review_log.reviewed_attachments = stage.base_stage.attachments.map { |attachment| { attachment_id: attachment.label, accepted: evaluator.pass } }
      review_log.reviewed_message = 'reject' unless evaluator.pass
    end
  end
end
