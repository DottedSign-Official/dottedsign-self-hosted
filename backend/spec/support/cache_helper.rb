RSpec.shared_context 'redis_cache' do
  let(:cache_namespace) do
    test_env_number = ENV['TEST_ENV_NUMBER'].to_s
    "rspec_cache_#{test_env_number.empty? ? '1' : test_env_number}"
  end
  let(:memory_store) do
    ActiveSupport::Cache.lookup_store(
      :redis_cache_store,
      url: Settings.redis.default.url,
      namespace: cache_namespace
    )
  end
  let(:cache) { Rails.cache }

  before(:each) do
    allow(Rails).to receive(:cache).and_return(memory_store)
    Rails.cache.clear
  end
end
