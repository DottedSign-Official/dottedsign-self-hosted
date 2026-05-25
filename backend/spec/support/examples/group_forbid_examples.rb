RSpec.shared_examples 'group_task_forbid_examples' do |http_method, permission_type, role, rpdoc_example_key|
  include_context 'api_call'

  it 'should return 403036 if group not allowed', rpdoc_example_key: rpdoc_example_key, rpdoc_example_name: "#{permission_type} failed (group forbid #{role})" do
    permission = [permission_type, role].compact.join('_')
    permission = permission_type if Settings.default.permission_keys.exclude?(permission)
    mock_permission(@member, "#{permission}": false)
    call_api(http_method, @path, @params, @headers)
    expect(response).to have_http_status(403)
    expect(json['error_code']).to eq(403036)
    expect(json['error_key']).to eq('task_not_accessible')
  end

end

RSpec.shared_examples 'group_envelope_forbid_examples' do |http_method, permission_type, role, rpdoc_example_key|
  include_context 'api_call'

  it 'should return 403067 if group not allowed', rpdoc_example_key: rpdoc_example_key, rpdoc_example_name: "#{permission_type} failed (group forbid #{role})" do
    permission = [permission_type, role].compact.join('_')
    permission = permission_type if Settings.default.permission_keys.exclude?(permission)
    mock_permission(@member, "#{permission}": false)
    call_api(http_method, @path, @params, @headers)
    expect(response).to have_http_status(403)
    expect(json['error_code']).to eq(403067)
    expect(json['error_key']).to eq('envelope_not_accessible')
  end

end

RSpec.shared_examples 'group_forbid_examples' do |http_method, permission_type, role, rpdoc_example_key|
  include_context 'api_call'

  it 'should return 403056 if group not allowed', rpdoc_example_key: rpdoc_example_key, rpdoc_example_name: "#{permission_type} failed (group forbid #{role})" do
    permission = [permission_type, role].compact.join('_')
    permission = permission_type if Settings.default.permission_keys.exclude?(permission)
    mock_permission(@member, "#{permission}": false)
    call_api(http_method, @path, @params, @headers)
    expect(response).to have_http_status(403)
    expect(json['error_code']).to eq(403056)
    expect(json['error_key']).to eq('group_not_accessible')
  end

end
