require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'manage'
    example.metadata[:rpdoc_action_name] = 'manage tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @member.tag_list.add('Tag 1', 'Tag 2', 'Tag 3', 'Tag 4')
    @member.save
    @member.reload
    @path = '/api/v1/tags/manage'
    @template = FactoryBot.create(:template, owner: @member)
  end

  describe '#manage' do
    context '[task]' do
      before(:each) do
        @task = FactoryBot.create(:sign_task, owner: @member)
        @origin_tags = ['Tag 1', 'Tag 2']
        @member.tag(@task, with: @origin_tags, on: :tags)
        @params = {
          taggable_type: 'SignTask',
          taggable_id: @task.id,
          add_tags: ['Tag 4'],
          remove_tags: ['Tag 1']
        }
      end
  
      it 'should return 200 and tag a task', rpdoc_example_key: 200, rpdoc_example_name: 'tag a task success' do
        put @path, params: @params.to_json, headers: @headers
        task_tags = @task.tags.pluck(:name)
        result_tags = @origin_tags + @params[:add_tags] - @params[:remove_tags]
        expect(response).to have_http_status(200)
        expect(task_tags).to match_array(result_tags)
      end
  
      it 'should return 200 and tag multiple tasks', rpdoc_example_key: 200_2, rpdoc_example_name: 'tag multiple tasks success' do
        task2 = FactoryBot.create(:sign_task, owner: @member)
        task2_origin_tags = ['Tag 1', 'Tag 3']
        @member.tag(task2, with: task2_origin_tags, on: :tags)
        @params[:taggable_type] = 'Batch'
        @params[:taggable_id] = { task_ids: [@task.id, task2.id] }
        put @path, params: @params.to_json, headers: @headers
        task_tags = @task.tags.pluck(:name)
        task2_tags = task2.tags.pluck(:name)
        result_tags = @origin_tags + @params[:add_tags] - @params[:remove_tags]
        result2_tags = task2_origin_tags + @params[:add_tags] - @params[:remove_tags]
        expect(response).to have_http_status(200)
        expect(task_tags).to match_array(result_tags)
        expect(task2_tags).to match_array(result2_tags)
      end
  
      it 'should return 403051 when some requested tags do not belong to the user', rpdoc_example_key: 403051, rpdoc_example_name: 'tag a task failed (tag not own)' do
        @params[:add_tags] = ['Tag 1', 'Tag 5']
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403051)
        expect(json['error_key']).to eq('tag_not_own')
      end
  
      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'tag a task failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end

    context '[envelope]' do
      before(:each) do
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        @origin_tags = ['Tag 1', 'Tag 2']
        @member.tag(@envelope, with: @origin_tags, on: :tags)
        @params = {
          taggable_type: 'Envelope',
          taggable_id: @envelope.id,
          add_tags: ['Tag 4'],
          remove_tags: ['Tag 1']
        }
      end
  
      it 'should return 200 and tag a envelope', rpdoc_example_key: 200, rpdoc_example_name: 'tag a envelope success' do
        put @path, params: @params.to_json, headers: @headers
        envelope_tags = @envelope.tags.pluck(:name)
        result_tags = @origin_tags + @params[:add_tags] - @params[:remove_tags]
        expect(response).to have_http_status(200)
        expect(envelope_tags).to match_array(result_tags)
      end
  
      it 'should return 200 and tag multiple tasks', rpdoc_example_key: 200_2, rpdoc_example_name: 'tag multiple envelopes success' do
        envelope2 = FactoryBot.create(:completed_envelope)
        envelope2_origin_tags = ['Tag 1', 'Tag 3']
        @member.tag(envelope2, with: envelope2_origin_tags, on: :tags)
        @params[:taggable_type] = 'Batch'
        @params[:taggable_id] = { envelope_ids: [@envelope.id, envelope2.id] }
        put @path, params: @params.to_json, headers: @headers
        envelope_tags = @envelope.tags.pluck(:name)
        envelope2_tags = envelope2.tags.pluck(:name)
        result_tags = @origin_tags + @params[:add_tags] - @params[:remove_tags]
        result2_tags = envelope2_origin_tags + @params[:add_tags] - @params[:remove_tags]
        expect(response).to have_http_status(200)
        expect(envelope_tags).to match_array(result_tags)
        expect(envelope2_tags).to match_array(result2_tags)
      end
  
      it 'should return 403051 when some requested tags do not belong to the user', rpdoc_example_key: 403051, rpdoc_example_name: 'tag a envelope failed (tag not own)' do
        @params[:add_tags] = ['Tag 1', 'Tag 5']
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403051)
        expect(json['error_key']).to eq('tag_not_own')
      end
  
      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'tag a envelope failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end

    context '[template]' do
      before(:each) do
        @template = FactoryBot.create(:template, owner: @member)
        @params = {
          taggable_type: 'Template',
          taggable_id: @template.id
        }
      end
  
      it 'should return 200 and tag a template', rpdoc_example_key: 200_3, rpdoc_example_name: 'tag a template success' do
        @params[:add_tags] = ['Tag 1', 'Tag 2']
        put @path, params: @params.to_json, headers: @headers
        template_tags = @template.tags.pluck(:name)
        expect(response).to have_http_status(200)
        expect(template_tags).to match_array(@params[:add_tags])
      end
  
      it 'should return 403051 when some requested tags do not belong to the user', rpdoc_example_key: 403051_2, rpdoc_example_name: 'tag a template failed (tag not own)' do
        @params[:add_tags] = ['Tag 1', 'Tag 5']
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403051)
        expect(json['error_key']).to eq('tag_not_own')
      end
  
      it 'should return 400003 if invalid member', rpdoc_example_key: 400003_2, rpdoc_example_name: 'tag a template failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end
  end
end
