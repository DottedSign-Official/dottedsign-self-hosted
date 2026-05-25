RSpec.shared_examples 'group_allow_examples' do |http_method, permission_type, role, rpdoc_example_key|
  include_context 'api_call'

  it 'should return 200 if group allowed', rpdoc_example_key: rpdoc_example_key, rpdoc_example_name: "#{permission_type} success (group allowed #{role})" do
    call_api(http_method, @path, @params, @headers)
    expect(response).to have_http_status(200)
  end

end
