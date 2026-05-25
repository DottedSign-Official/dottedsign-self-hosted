module Form
  class Start < ServiceCaller
    attr_reader :task

    def initialize(form_uuid, signer_info, client_info)
      @form_uuid = form_uuid
      @signer_info = signer_info
      @client_info = client_info
    end

    def call
      verify_for_preview
      create_task
      start_task
      @result = {
        task_id: @task.id,
        form_token: @task.form_token
      }
    end

    private

    def verify_for_preview
      verify = PreviewVerify.call(@form_uuid, @signer_info)
      raise verify.error if verify.failed?
      @public_form = verify.result
    end

    def create_task
      raise ServiceError.new(:member_not_found) if @public_form.owner.nil?

      task_info = {
        form_id: @public_form.id,
        file_name: @public_form.form_name,
        stages: format_signer_info
      }
      create_service = Factories::TemplateTask::Form.call(@public_form.owner, @public_form.template_id, task_info, @client_info)
      raise create_service.error if create_service.failed?
      @task = create_service.result
    end

    def format_signer_info
      @public_form.signer_infos.map.with_index do |signer_info, index|
        if signer_info['signer_type'] == 'form_signer'
          signer_info.merge!(@signer_info) if index.zero?
          stage_setting = { requisite: signer_info.delete('requisite') }
          {
            role: signer_info['role'],
            name: 'Form Signer',
            email: Settings.system_members.form_signer,
            action: 'form_sign',
            actor_info: signer_info,
            stage_setting: stage_setting
          }
        else
          signer_info.slice('role', 'name', 'email', 'phone').symbolize_keys
        end
      end
    end

    def start_task
      @task.start(@client_info)
    end

  end
end
