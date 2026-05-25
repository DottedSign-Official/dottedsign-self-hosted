FactoryBot.define do
  factory :sign_log do
    transient do
      changed { true }
    end

    before(:create) do |sign_log, evaluator|
      sign_log.signed_fields = sign_log.stage.field_settings.map { |field_setting| { field_object_id: field_setting.field_object_id, changed: evaluator.changed } }
      sign_log.signed_attachments = sign_log.stage.attachments.map { |attachment| { attachment_id: attachment.label, changed: evaluator.changed } }
    end
  end
end
