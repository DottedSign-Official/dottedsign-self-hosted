require 'resolv'

module MockHelper

  def mock_template_group_share_enable
    stub_const('GROUP_TEMPLATE_SHARE_ENABLE', true)
  end

  def mock_developer
    allow_any_instance_of(Member).to receive(:super_admin?).and_return(true)
  end

  def mock_client
    Doorkeeper::Application.create(name: 'Default App', confidential: true, uid: 'uid', secret: 'secret')
  end

  def mock_headers(http_method: :post, content_type: 'application/json', with_token: true, other_info: {})
    @headers = {
      'User-Agent' => 'RSpec'
    }.merge!(other_info)
    @headers['Content-Type'] = content_type unless http_method == :get
    @headers['Authorization'] = 'Bearer {{rabbit_token}}' if with_token
    @headers
  end

  def mock_access_token(app: nil, member: nil)
    create(:access_token, resource_owner_id: member.id, application_id: app.id)
  end

  def mock_preview_code_accepted(task, stage)
    preview_code = task.original_file.preview_code(stage)
    @cache_key = "#{preview_code}:quick_sign_accept"
    @cache_value = {
      accepted_at: Time.zone.now.to_i,
      client: 'web',
      ip_address: '127.0.0.1',
      work_id: 'work_id'
    }
    Rails.cache.write(@cache_key, @cache_value, expires_in: ServiceFile::PREVIEW_EXPIRED_IN)
    preview_code
  end

  def mock_member(member_type, skip_auth: false)
    mock_decline_reasons
    mock_otp_verify
    mock_opt_send
    mock_mail_center
    mock_notification_center

    member = FactoryBot.create(member_type)
    mock_setup_current_member(member) unless skip_auth
    member
  end

  def mock_setup_current_member(member)
    allow_any_instance_of(ApplicationController).to receive(:setup_current_member).and_return(true)
    allow_any_instance_of(ApplicationController).to receive(:current_member).and_return(member)
    member
  end

  def mock_group(member, role: 'manager', group_name: 'Default Group')
    group = Group.find_by(name: group_name)
    if group.nil?
      member.generate_group(group_name)
    else
      invite = group.add_member(member)
      invite.accept!
      member.reload
      group.assign_role(member, [role])
      group
    end
  end

  def mock_group_kick(member)
    return if member.group.nil?
    member.update(group_id: nil)
  end

  def mock_permission(member, **permission)
    return if member.group_id.nil?
    member.current_roles.each do |role|
      role.permission.merge!(permission)
      role.save
    end
  end

  def mock_worker(worker)
    allow(worker).to receive(:perform_async).and_return("start_background_job")
  end

  def mock_service(service, **kwargs)
    allow(service).to receive(:call).and_return(MockService.new(**kwargs))
  end

  def mock_http_send
    response = { 'status' => 200 }
    allow_any_instance_of(JsonRequester).to receive(:http_send).and_return(response)
  end

  def mock_hsm_secret_key
    secret_key = OpenSSL::PKey::RSA.new(2048)
    allow(Secrets).to receive(:hsm_secret_key).and_return(secret_key)
  end

  def mock_upload
    allow_any_instance_of(ServiceFile).to receive(:upload) do |instance|
      instance.uploaded_at = Time.now
      instance.save
      true
    end

    allow_any_instance_of(ServiceFile).to receive(:force_upload_thumbnail) do |instance|
      instance.uploaded_at = Time.now
      instance.save
    end

    allow_any_instance_of(ActiveStorage::Attached::One).to receive(:attach).and_return(true)
    allow_any_instance_of(ActiveStorage::Attached::One).to receive(:attached?).and_return(true)
  end

  def mock_file_attached
    allow_any_instance_of(ActiveStorage::Attached::One).to receive(:attached?).and_return(true)
  end

  def mock_file_processing_service
    mock_path = "#{Rails.root}/spec/fixtures/files/test.pdf"
    mock_service(DataInsert)
    mock_service(DataInsert::TextInsert)
    mock_service(ThumbnailMaker, result: mock_path, working_dir: Dir.mktmpdir)
    mock_service(KmpdfTool::PdfFormGenerator, result: mock_path, working_dir: Dir.mktmpdir)
    allow_any_instance_of(SignTask).to receive(:xfdf_ready?).and_return(true)
  end

  def mock_stage_file
    allow_any_instance_of(Stage).to receive_message_chain(:stage_file, :nil?).and_return(false)
  end

  def mock_download(download_type = 'application/pdf')
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :attached?).and_return(true)
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :download).and_return('file_content')
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :blob, :content_type).and_return(download_type)
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :blob, :byte_size).and_return(1111)
    mock_envelope_file
  end

  def mock_envelope_file
    mock_result = {
      content: 'mocked content',
      content_type: 'application/zip',
      file_name: 'envelope.zip',
      size: 1111
    }
    allow_any_instance_of(Envelope).to receive_message_chain(:original_file, :download).and_return(mock_result)
    allow_any_instance_of(Envelope).to receive_message_chain(:completed_file, :download).and_return(mock_result)
    allow_any_instance_of(Envelope).to receive_message_chain(:original_file, :label).and_return('original')
    allow_any_instance_of(Envelope).to receive_message_chain(:completed_file, :label).and_return('completed')
    allow_any_instance_of(Envelope).to receive_message_chain(:audit_trail_file, :download).and_return(mock_result)
  end

  def mock_stage_file
    allow_any_instance_of(SignStage).to receive_message_chain(:stage_file, :nil?).and_return(false)
  end

  def mock_signature
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :attached?).and_return(true)
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :download).and_return('image')
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :filename).and_return('signature.png')
  end

  def mock_mini_magick
    mock_mini_magick = double('MiniMagick::Image')
    allow(MiniMagick::Image).to receive(:read).and_return(mock_mini_magick)
    allow(mock_mini_magick).to receive(:type).and_return('png')
    allow(mock_mini_magick).to receive(:mime_type).and_return('image/png')
  end

  def mock_app_upload(task)
    file = task.service_files.find_by(label: 'original')
    file.uploaded_at = Time.zone.now
    file.save!

    file = task.service_files.find_by(label: 'full')
    file.uploaded_at = Time.zone.now
    file.save!
  end

  def mock_export_worker(task)
    task.sign_stages.each do |stage|
      XfdfDocument.create(sign_task_id: task.id, source_type: 'SignTask', source_id: task.id, stage_type: 'SignStage', stage_id: stage.id, content: 'content')
    end
  end

  def mock_complete_worker(task)
    file = task.service_files.find_by(label: 'completed')
    file.uploaded_at = Time.zone.now
    file.save!
  end

  def mock_task_start(task)
    task.start('app', '127.0.0.1', '')
  end

  def mock_current_time(delta)
    allow(Time).to receive(:now).and_return(delta)
  end

  def setup_inperson_task(task, verify_type = 'email')
    req = {
      headers: { 'Authorization' => 'Bearer {{rabbit_token}}' },
      params: {
        sign_task_id: task.id,
        signer_order: task.sign_stages.pluck(:email),
        verify: [{ verify_type: verify_type }]
      }
    }
    post("/api/v2/inperson/setup", req)
  end

  def mock_verify_inperson(task)
    cache_key = {
      ip_address: '192.168.1.1',
      stage_id: task.processing_stages.first.id
    }
    Rails.cache.write(cache_key, 'verify_token', expires_in: 5.seconds)
    cache_key
  end

  def mock_share_link
    allow_any_instance_of(SignTask).to receive(:share_link).and_return('http://share_link')
  end

  def mock_opt_send
    response = { 'status' => 200 }
    SmsCenter::Base.descendants.each { |sms| allow(sms).to receive(:deliver).and_return(response) }
  end

  def mock_field_value(field_type)
    case field_type
    when 'signature', 'guest_signature', 'image'
      return
    when 'textfield'
      'text'
    when 'datefield'
      Time.zone.now.strftime('%Y/%m/%d')
    when 'link'
      'https://example.com'
    else
      false
    end
  end

  def mock_kiosk_task(template, member)
    mock_upload
    mock_client_info
    stages = template.dummy_stages.map.with_index do |stage, index|
      {
        role: "A_#{index}",
        others: {
          requisite: {
            name: 'optional',
            email: 'required',
            phone: 'disabled'
          },
          informable: (index % 2 == 0)
        }
      }
    end
    task_info = { sign_type: 'kiosk', file_name: 'Kiosk Task', stages: stages }
    creator = Factories::TemplateTask::Kiosk.call(member, template.id, task_info, client_info: @client_info)
    return if creator.failed?
    creator.task.start(@client_info)
    creator.task
  end

  def mock_kiosk_read(task)
    stage = task.dummy_stages.processing.first
    stage.update(actor_info: { name: 'Kiosk Signer Name', email: 'kiosk@test.com', phone: '+0123456789' })
    task.add_sign_event(:viewed, nil, stage_info: stage.basic_info, client_info: task.start_from, other_info: { execute_type: 'kiosk' })
  end

  def mock_form_task_read(form = nil)
    form ||= create(:public_form)
    form_task = setup_form_task(form)
    member = Member.find_by_email(Settings.system_members.form_signer)
    read_info = ActiveSupport::HashWithIndifferentAccess.new({
      signer_info: {
        name: 'Test 2',
        email: 'test2@test.com'
      }
    })
    read_service = Form::Read.call(form_task.id, member, read_info, @client_info)
    read_service.task
  end

  def setup_form_task(form)
    mock_group(form.owner)
    mock_client_info
    mock_upload
    mock_sign
    mock_stage_file
    signer_info = { name: 'Test 1', email: 'test1@test.com' }
    first_stage = form.template.dummy_stages.first
    field_setting = first_stage.field_settings.first
    guest_sign = FactoryBot.create(:guest_signature)
    sign_info = {
      signature_info: [{
        object_id: field_setting.field_object_id,
        type: 'signature',
        value: guest_sign.id,
      }]
    }
    start_service = Form::Start.call(form.uuid, signer_info, @client_info)
    form_task = start_service.task
    member = form_task.sign_stages.first.actor
    sign_service = Form::Sign.call(form_task.id, member, sign_info, @client_info)
    sign_service.task
  end

  def mock_client_info
    @client_info ||= {
      client: 'web',
      ip_address: '0.0.0.0',
      user_agent: 'user_agent',
      work_id: 'work_id'
    }
  end

  def mock_sign
    FieldSetting.subclasses.each do |sub_class|
      allow_any_instance_of(sub_class).to receive(:match_content?).with(any_args).and_return(true)
    end
    allow_any_instance_of(DataInsert).to receive(:success?).and_return(true)
    allow_any_instance_of(DataInsert).to receive(:failed?).and_return(false)
  end

  def build_test_members
    @ada = create(:member_a)
    @bella = create(:member_b)
    @cindy_email = 'cindy@test.com'
    @me = create(:member_me)
    @otp_member = create(:member_otp)
    @not_register_member = create(:not_register_member)
  end

  def build_all_tasks
    @draft = create(:draft_task)
    @waiting_for_me1 = create(:waiting_for_me1)
    @waiting_for_others1 = create(:waiting_for_others1)
    @sign_and_send_completed = create(:me_completed_self_task)
    @completed1 = create(:completed_task1)
    @completed2 = create(:completed_task2)
    @waiting_for_me2 = create(:waiting_for_me2)
    @waiting_for_others2 = create(:waiting_for_others2)
    @waiting_for_others3 = create(:waiting_for_others3)
    @completed3 = create(:completed_task3)
    @not_related = create(:not_related)
    @owner_need_otp_task = create(:owner_need_otp_task)
    @signer_need_otp_task = create(:signer_need_otp_task)
  end

  def initialize_mock_and_members(roles = nil)
    mock_share_link
    build_test_members
  end

  def mock_decline_reasons
    reasons = [
      { content: 'sign_online_concern', system_reserved: true },
      { content: 'document_content_error', system_reserved: true },
      { content: 'not_signer', system_reserved: true },
      { content: 'not_interested', system_reserved: true },
      { content: 'others', system_reserved: true }
    ]
    DeclineReason.create(reasons)
  end

  def mock_otp_verify
    allow_any_instance_of(ROTP::TOTP).to receive(:generate_otp).and_return('000000')
    allow_any_instance_of(ROTP::TOTP).to receive(:verify).and_call_original
    allow_any_instance_of(ROTP::TOTP).to receive(:verify).with('000000').and_return(Time.now.to_i)
  end

  def mock_mail_center
    response = { 'status' => 200 }

    allow(MailCenter).to receive(:group_cancel).and_return(response)
    allow(MailCenter).to receive(:signer_verify).and_return(response)
  end

  def mock_share_setting(shared, target)
    ShareSetting.create(shared: shared, target: target)
  end

  def mock_with_sign_url_enable
    allow(Settings.default.sign_task.create_task).to receive(:with_sign_url_enable).and_return(true)
  end

  def mock_notification_center
    response = { 'status' => 200 }

    allow(NotificationCenter).to receive(:target_push).and_return(response)
  end
end
