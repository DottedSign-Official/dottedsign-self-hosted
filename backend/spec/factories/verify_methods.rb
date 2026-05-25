FactoryBot.define do
  factory :verify_method do
    execute_type { 'normal' }
    verify_type { 'email' }
    occassion { 'sign' }

    factory :cht_personal do
      verify_type { 'cht_personal' }
    end

    factory :cht_company do
      verify_type { 'cht_company' }
    end

    factory :email do
      verify_type { 'email' }
    end

    factory :sms do
      verify_type { 'sms' }
      verify_source { '+886987654321' }
    end

    before(:create) do |vm|
      vm.sequence = 1
    end 
  end
end
