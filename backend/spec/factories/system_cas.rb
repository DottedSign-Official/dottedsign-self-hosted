require 'openssl'

FactoryBot.define do
  factory :system_ca do
    name { "system_ca_name" }
    cluster_id { "system_ca_cluster_id" }
    token { "system_ca_token" }
    email { "system_ca_admin_email" }
    pem {
      OpenSSL::PKey::RSA.new(2048).to_s
    }
    group { nil }

    transient do
      member { nil }
    end

    after(:create) do |ca, evaluator|
      member = Member.find evaluator.member.id if evaluator.member.present?
      ca.members << member if member.present?
    end
  end
end
