class Callbacks::GraController < ApplicationController

  # result int 操作結果代碼，1 代表成功，非 1 代表失敗
  # resultMessage string 操作結果訊息
  # email string 使用者的電子郵件，失敗時為空值
  # expDate string 允許簽章的最後期限 (GRA server 時間)，失敗時為空值
  # tid 交易編號
  def authorize
    request_cache = Rails.cache.read("ca_request:#{params[:tid]}")
    if request_cache.present? && request_cache[:uuid].present?
      expire_at = Time.parse(params[:expDate])
      expire_in = expire_at.to_i - Time.now.to_i
      Rails.cache.write("ca_auth:#{request_cache[:uuid]}", params[:tid], expires_in: expire_in)
      vm = VerifyMethod.find_by(uuid: request_cache[:uuid])
      if vm.present?
        Rails.cache.write("#{vm.stage_type}:#{vm.stage_id}:tid", params[:tid], expires_in: expire_in)
        task = vm.stage.sign_task
        Rails.cache.write("envelope:#{task.envelope_id}:tid", params[:tid], expires_in: expire_in) if task.in_envelope?
      end
      socket_event = (params[:result].to_i == 1) ? :ca_auth_success : :ca_auth_failed
      send_gra_socket(socket_event, request_cache)
    end
    gra_callback_response
  end

  # email string 使用者的電子郵件
  # discountCode string 優惠折扣碼
  # whenCreated string 憑證申請完成時間 (14碼)
  # certSerial string 憑證序號
  def apply
    apply_cache = Rails.cache.read("ca_apply:#{params[:discountCode]}")
    return gra_callback_response if apply_cache.blank?
    if apply_cache[:uuid].present?
      auth = CaAuthenticator.call(params[:email], apply_cache[:verify_type], cache_info: apply_cache)
      socket_event = auth.success? ? :ca_apply_success : :ca_apply_failed
      send_gra_socket(socket_event, apply_cache)
    end
    gra_callback_response
  end

  private

  def gra_callback_response
    ap_info = DigitalCertificate::Gra.get_system_ap_info
    data = {
      oneTimeToken: ap_info[:one_time_token],
      signature: ap_info[:signature]
    }
    render json: data
  end

  def send_gra_socket(socket_event, cache_data)
    if cache_data[:member_id].present?
      SocketCenter.broadcast(cache_data[:member_id], event: socket_event)
    end

    if cache_data[:code].present?
      SocketCenter.broadcast_to_code(cache_data[:code], event: socket_event)
    end
  end

end
