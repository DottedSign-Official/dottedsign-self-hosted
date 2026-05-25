RSpec.shared_examples 'group_access_self_task_examples' do |http_method, permission_type|
  context '>> in group' do
    before(:each) do
      FactoryBot.create(:group_member)
      mock_group(@member)
    end

    context '>>> self sender' do
      before(:each) do
        @task = FactoryBot.create(:me_completed_self_task)
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, "#{permission_type}_self_task", 'self_sender', 200_001
      include_examples 'group_task_forbid_examples', http_method, "#{permission_type}_self_task", 'self_sender', 403036_01
    end

    context '>>> group sender' do
      before(:each) do
        @member_a = FactoryBot.create(:member_a)
        mock_group(@member_a)
        @task = FactoryBot.create(:a_completed_self_task)
        @params[:sign_task_id] = @task.id
      end

      include_examples 'group_allow_examples', http_method, "#{permission_type}_group_task", 'group_sender', 200_03
      include_examples 'group_task_forbid_examples', http_method, "#{permission_type}_group_task", 'group_sender', 403036_03
    end
  end
end
