FactoryBot.define do
  factory :access_token, class: 'Doorkeeper::AccessToken' do
    expires_in { 2.hours }
    use_refresh_token { true }
  end
end
