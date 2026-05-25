FactoryBot.define do
  factory :public_form do
    association :owner, factory: :member_me
    association :template, factory: :template, dummy_stage_count: 2
    sequence(:form_name) { |n| "Test Form #{n}" }
    sequence(:description) { |n| "This is test form #{n}" }
    goal_num { 3 }

    before(:create) do |form|
      form.signer_infos = form.template.dummy_stages.map do |dummy_stage|
        {
          role: dummy_stage.actor_info['role'],
          signer_type: 'form_signer',
          requisite: {
            name: 'required',
            email: 'optional'
          }
        }
      end
    end
  end
end
