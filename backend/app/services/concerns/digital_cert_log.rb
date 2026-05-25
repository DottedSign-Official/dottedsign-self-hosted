module DigitalCertLog
  def record_digital_cert_apply_log(sign_result, error_message: nil)
    return if @log_info.blank?
    @task = SignTask.find_by_id(@log_info[:task_id])
    raise ServiceError.new(:task_not_found) if @task.nil?
    extra_info = @log_info.slice(:stage_type, :stage_id)
    extra_info[:error_message] = error_message if error_message.present?
    extra_info[:other_info] = { tid: @cert_info[:tid] } if @cert_info[:tid].present?
    @task.add_sign_event("digit_cert_#{@log_info[:file_type]}_#{sign_result}", client_info: { client: 'signature_center' }, other_info: extra_info)
  end
end

