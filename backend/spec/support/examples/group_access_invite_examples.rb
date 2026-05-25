RSpec.shared_examples 'group_access_invite_task_examples' do |http_method, permission_type, task_status|
  context '>> in group' do
    before(:each) do
      FactoryBot.create(:group_member)
      mock_group(@member)
    end

    context '>>> self sender' do
      before(:each) do
        @task = FactoryBot.create(:"me_sender_#{task_status}_task")
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'self_sender', 200_01
      include_examples 'group_task_forbid_examples', http_method, permission_type, 'self_sender', 403036_01
    end

    context '>>> self signer' do
      before(:each) do
        @task = FactoryBot.create(:"me_signer_#{task_status}_task")
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'self_signer', 200_02
      include_examples 'group_task_forbid_examples', http_method, permission_type, 'self_signer', 403036_02
    end

    context '>>> group sender' do
      before(:each) do
        @member_a = FactoryBot.create(:member_a)
        mock_group(@member_a)
        @task = FactoryBot.create(:"a_sender_#{task_status}_task")
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'group_sender', 200_03
      include_examples 'group_task_forbid_examples', http_method, permission_type, 'group_sender', 403036_03
    end

    context '>>> group signer' do
      before(:each) do
        @member_a = FactoryBot.create(:member_a)
        mock_group(@member_a)
        @task = FactoryBot.create(:"a_signer_#{task_status}_task")
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'group_signer', 200_04
      include_examples 'group_task_forbid_examples', http_method, permission_type, 'group_signer', 403036_04
    end
  end
end

RSpec.shared_examples 'group_access_invite_envelope_examples' do |http_method, permission_type, envelope_status|
  context '>> in group' do
    before(:each) do
      FactoryBot.create(:group_member)
      mock_group(@member)
    end

    context '>>> self sender' do
      before(:each) do
        @envelope = FactoryBot.create(:"me_sender_#{envelope_status}_envelope")
        @params[:envelope_id] = @envelope.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'self_sender', 200_2
      include_examples 'group_envelope_forbid_examples', http_method, permission_type, 'self_sender', 403067_2
    end

    context '>>> self signer' do
      before(:each) do
        @envelope = FactoryBot.create(:"me_signer_#{envelope_status}_envelope")
        @params[:envelope_id] = @envelope.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'self_signer', 200_3
      include_examples 'group_envelope_forbid_examples', http_method, permission_type, 'self_signer', 403067_3
    end

    context '>>> group sender' do
      before(:each) do
        @member_a = FactoryBot.create(:member_a)
        mock_group(@member_a)
        @envelope = FactoryBot.create(:"a_sender_#{envelope_status}_envelope")
        @params[:envelope_id] = @envelope.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'group_sender', 200_4
      include_examples 'group_envelope_forbid_examples', http_method, permission_type, 'group_sender', 403067_4
    end

    context '>>> group signer' do
      before(:each) do
        @member_a = FactoryBot.create(:member_a)
        mock_group(@member_a)
        @envelope = FactoryBot.create(:"a_signer_#{envelope_status}_envelope")
        @params[:envelope_id] = @envelope.id
      end

      include_examples 'group_allow_examples', http_method, permission_type, 'group_signer', 200_5
      include_examples 'group_envelope_forbid_examples', http_method, permission_type, 'group_signer', 403067_5
    end
  end
end
