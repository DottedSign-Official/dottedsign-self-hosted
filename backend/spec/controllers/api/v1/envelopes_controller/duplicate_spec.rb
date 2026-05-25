require 'rails_helper'

RSpec.describe Api::V1::EnvelopesController, type: :request do
  include_context 'rpdoc'

  describe '#duplicate' do
    let!(:member) { mock_member(:member_me) }
    let(:excepted_fields) { [:id, :deadline, :expire_remind_at, :created_at, :updated_at] }
    
    let(:headers) do
      {
        'Authorization' => 'Bearer {{rabbit_token}}',
        'Content-Type' => 'application/json'
      }
    end
    let(:path) { '/api/v1/envelopes/duplicate' }

    before(:each) do |example|
      example.metadata[:rpdoc_action_key] = 'duplicate'
      example.metadata[:rpdoc_action_name] = 'Duplicate an envelope'
      example.metadata[:rpdoc_example_folders] = ['v1', 'envelopes']
    end

    it 'should return 200 and duplicate envelope success', rpdoc_example_key: 200, rpdoc_example_name: 'duplicate envelope success' do
      envelope = create(:expired_envelope)
      params = { envelope_id: envelope.id }
      post path, params: params.to_json, headers: headers

      expect(response.status).to eq(200)
      
      new_envelope = Envelope.includes(:sign_tasks, :dummy_stages, :envelope_setting).find(json['data']['envelope_id'])
      envelope.reload
      verify_envelope_duplication(new_envelope, envelope)
      verify_task_duplication(new_envelope, envelope)
    end

    private

    def verify_envelope_duplication(new_envelope, original_envelope)
      expect(new_envelope).to have_attributes(
        envelope_name: original_envelope.envelope_name,
        status: 'draft',
        owner_id: member.id,
        has_order: original_envelope.has_order
      )
      expect(new_envelope.sign_tasks.size).to eq(original_envelope.sign_tasks.size)
      expect(new_envelope.stages.size).to eq(original_envelope.stages.size)

      envelope_excepted_fields = excepted_fields << :envelope_id
      new_setting = new_envelope.envelope_setting
      expect(new_setting.as_json(except: envelope_excepted_fields)).to eq(original_envelope.envelope_setting.as_json(except: envelope_excepted_fields))
      expect(new_setting.deadline).to be_nil
      expect(new_setting.expire_remind_at).to be_nil
    end

    def verify_task_duplication(new_envelope, original_envelope)
      original_task = original_envelope.sign_tasks.includes(:task_setting, :field_settings, :field_setting_groups, :dummy_stages).first
      new_task = new_envelope.sign_tasks.includes(:task_setting, :field_settings, :field_setting_groups, :dummy_stages).first

      expect(new_task).to have_attributes(
        file_name: original_task.file_name,
        status: 'draft',
        owner_id: member.id,
        position: original_task.position
      )
      expect(new_task.stages.size).to eq(original_task.stages.size)
      expect(new_task.field_settings.size).to eq(original_task.field_settings.size)
      expect(new_task.field_setting_groups.size).to eq(original_task.field_setting_groups.size)

      new_stage = new_task.sign_stages.first
      expect(new_stage.status).to eq('initial')
      expect(new_stage.sequence).to eq(1)

      task_excepted_fields = excepted_fields << :sign_task_id
      new_setting = new_task.task_setting
      expect(new_setting.as_json(except: task_excepted_fields)).to eq(original_task.task_setting.as_json(except: task_excepted_fields))
      expect(new_setting.deadline).to be_nil
      expect(new_setting.expire_remind_at).to be_nil
    end

    it 'should return 404_048 when original envelope is not found', rpdoc_example_key: 404_048, rpdoc_example_name: 'duplicate envelope failed (envelope not found)' do
      params = { envelope_id: 9999 }
      post path, params: params.to_json, headers: headers

      expect(response.status).to eq(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('envelope_not_found')
    end

    it 'should return 403_071 when trying to duplicate non-duplicable envelope', rpdoc_example_key: 403_071, rpdoc_example_name: 'duplicate envelope failed (envelope not duplicable)' do
      draft_envelope = create(:draft_envelope)
      params = { envelope_id: draft_envelope.id }
      post path, params: params.to_json, headers: headers

      expect(response.status).to eq(403)
      expect(json['error_code']).to eq(403_071)
      expect(json['error_key']).to eq('envelope_not_duplicable')
    end

    it 'should return 403_065 when trying to duplicate envelope not owned', rpdoc_example_key: 403_065, rpdoc_example_name: 'duplicate envelope failed (no permission)' do
      envelope = create(:expired_envelope, owner: create(:member_a))
      params = { envelope_id: envelope.id }
      post path, params: params.to_json, headers: headers

      expect(response.status).to eq(403)
      expect(json['error_code']).to eq(403_065)
      expect(json['error_key']).to eq('envelope_not_owned')
    end
  end
end 