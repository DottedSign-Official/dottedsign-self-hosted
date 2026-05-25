class Api::Internal::Mailer::SignMailerController < Api::Internal::MailController

  def sign_request; end

  def sign_complete; end

  def kiosk_complete; end

  def sign_decline; end

  def sign_modify; end

  def sign_confirm; end

  def sign_pass; end

  def forget_remind; end

  def signer_verify; end

  def verify_method_changed; end

  def forward_request; end

  def task_update; end

  def task_disable; end

  def task_deleted_remind; end

  def expire_remind; end

  def deadline_change; end

  def doc_backup; end

  def signer_ca_fail_notify; end

  def cc_sign_start; end

  def cc_sign_complete; end

  def owner_changed_notification; end

  private

  def mailer
    ApplicationMailer.const_get('SignMailer')
  end

  def classify_sign_request_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :file_link]
    @permit_attrs = @require_attrs + [:deadline, :sender_name, :stage_action, :message, :signer_name]
  end

  def classify_sign_complete_params
    @require_attrs = [:email, :user_name, :doc_name, :file_link, :total_size, :template_name, :sender_email, :sender_name]
    @permit_attrs = @require_attrs + [:can_download_task, :can_download_audit_trail, :doc_download_link, :completed_message, :file_extension]
  end

  def classify_kiosk_complete_params
    @require_attrs = [:sender_email, :sender_name, :email, :doc_name, :doc_download_link, :total_size]
    @permit_attrs = @require_attrs + [:message]
  end

  def classify_sign_decline_params
    @require_attrs = [:email, :email_info, :sender_email, :sender_name, :doc_name]
    @permit_attrs = @require_attrs + [:decline_reason, :decline_message, :file_link]
  end

  def classify_sign_modify_params
    @require_attrs = [:email, :user_name, :sender_email, :sender_name, :doc_name, :file_link, :message]
    @permit_attrs = @require_attrs
  end

  def classify_sign_confirm_params
    @require_attrs = [:email, :user_name, :doc_name, :file_link]
    @permit_attrs = @require_attrs
  end

  def classify_sign_pass_params
    @require_attrs = [:email, :user_name, :doc_name]
    @permit_attrs = @require_attrs
  end

  def classify_forget_remind_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :file_link, :pass_days]
    @permit_attrs = @require_attrs + [:sender_name]
  end

  def classify_signer_verify_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :otp_code]
    @permit_attrs = @require_attrs + [:sender_name]
  end

  def classify_verify_method_changed_params
    @require_attrs = [:email, :user_name, :change_time]
    @permit_attrs = @require_attrs + [:otp_via_email, :otp_via_phone, :phone_number]
  end

  def classify_forward_request_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :file_link]
    @require_attrs += [:message] if params[:new_signer].blank?
    @permit_attrs = @require_attrs + [:group_icon_url, :sender_name, :message, new_signer: [:email, :name]]
  end

  def classify_task_update_params
    @require_attrs = [:email, :user_name, :doc_name, :file_link, :old_receiver_email, :new_receiver_email, :execute_by]
    @permit_attrs = @require_attrs + [:new_receiver_name, :old_receiver_name, :forward_reason]
  end

  def classify_task_disable_params
    @require_attrs = [:email, :user_name, :doc_name, :sender_email, :new_receiver_email, :execute_by]
    @permit_attrs = @require_attrs + [:sender_name, :new_receiver_name]
  end

  def classify_task_deleted_remind_params
    @require_attrs = [:email, :user_name, :task_name, :sender_email]
    @permit_attrs = @require_attrs + [:sender_name]
  end

  def classify_expire_remind_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :file_link, :deadline]
    @permit_attrs = @require_attrs + [:sender_name]
  end

  def classify_deadline_change_params
    @require_attrs = [:email, :user_name, :sender_email, :doc_name, :file_link, :deadline]
    @permit_attrs = @require_attrs + [:sender_name]
  end

  def classify_doc_backup_params
    @require_attrs = [:email, :user_name, :doc_name, :file_link, :total_size, :doc_download_link]
    @permit_attrs = @require_attrs + [:attachment_link]
  end

  def classify_signer_ca_fail_notify_params
    @require_attrs = [:email, :name, :doc_name, :file_link]
    @permit_attrs = @require_attrs + [:deadline]
  end

  def classify_cc_sign_start_params
    @require_attrs = [:emails, :actor_info, :doc_name, :sender_name, :sender_email]
    @permit_attrs = @require_attrs + [actor_info: {}]
  end

  def classify_cc_sign_complete_params
    @require_attrs = [:emails, :doc_name, :sender_name, :sender_email, :total_size, :doc_download_link]
    @permit_attrs = @require_attrs + [:file_extension]
  end

  def classify_owner_changed_notification_params
    @require_attrs = [:email, :user_name, :doc_name, :old_owner_name, :new_owner_name, :new_owner_email]
    @permit_attrs = @require_attrs
  end

end
