FactoryBot.define do
  factory :sign_event do
    ip_address { '0.0.0.0' }
    device { 'web' }
    user_agent { {plain: 'plain user agent', display: 'display user agent'} }
  end
end
