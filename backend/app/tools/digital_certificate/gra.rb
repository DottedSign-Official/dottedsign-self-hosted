module DigitalCertificate
  class Gra
    REQUESTER = JsonRequester.new(Settings.gra.host)

    class << self
      # res: {"status"=>200, "result"=>1, "resultMessage"=>"成功執行操作", "certificate"=>"", "container"=>"", "body_status"=>"NOTISSUE"}
      def check_ca(email='AATL-TEST-AP@protonmail.com', path_version: 'v1')
        path = Settings.gra.path.send(path_version).check_ca.freeze
        one_time_token = format_token
        params = {
          account: email,
          oneTimeToken: one_time_token,
          signature: make_signature(one_time_token)
        }
        REQUESTER.http_send(:post, path, params)
      end

      # request explanation:
      #   - helpMessage [String]: (選填) 使用者在雲端金鑰啟用認證信件裡看到的訊息，例如:簽署文件名稱、簽署發起者。(最多 100 個字)
      #   - envelop [Array]: (選填) 如欲在單一授權索取中，指定該授權可用於多份文件，則必需要填下列陣列資訊 (後續有幾個文件要在此階段申請授權，都需要在此階段傳入參數)，包含文件名稱與 UUID
      # without cert res: {"status"=>200, "result"=>13008, "resultMessage"=>"申辦連結:https://hikey.hinet.net/gra,請提醒用戶選擇 Adobe 認可信任清單憑證(AATL Certificate)產品進行申辦", "tid"=>"", "discountCode"=>"CHT-AATL-P-1Y001-U0mVu", "body_status"=>nil}
      # with cert res: {"status"=>200, "result"=>1, "resultMessage"=>"成功執行操作", "tid"=>"d8096abb-4bc5-45bb-a5eb-cfd4aa22f755", "discountCode"=>"", "body_status"=>nil}
      def auth_ca(email='AATL-TEST-IND@protonmail.com', personal: true, expires_in: '1Y', envelope_info: {}, path_version: 'v1')
        path = Settings.gra.path.send(path_version).auth_ca.freeze
        one_time_token = format_token
        params = {
          account: email,
          authType: "email",
          oneTimeToken: one_time_token,
          signature: make_signature(one_time_token),
          certificateType: personal ? 'P' : 'O',
          certificateValidity: expires_in,
          helpMessage: build_help_message(envelope_info),
          envelop: envelope_info[:task_infos]
        }.compact
        REQUESTER.http_send(:post, path, params)
      end

      # res: {"status"=>200, "result"=>1, "resultMessage"=>"成功執行操作", "url"=>"[apply cert link]"}
      def apply_ca(email, discount_code, personal: true, return_to: Settings.branch_deep_link.web, path_version: 'v1')
        path = Settings.gra.path.send(path_version).apply_ca.freeze
        one_time_token = format_token
        params = {
          email: email,
          authType: 'IC',
          certificateType: personal ? 'P' : 'O',
          discountCode: discount_code,
          partner: 'DottedSign',
          returnUrl: return_to || Settings.branch_deep_link.web,
          oneTimeToken: one_time_token,
          signature: make_signature(one_time_token)
        }
        REQUESTER.http_send(:post, path, params)
      end

      def get_system_ap_info(task_id: nil)
        token = format_token
        long_id = task_id.present? ? SignTask.find(task_id).long_id : nil
        {
          cluster_id: Settings.hsm.sign_cluster_id,
          email: Settings.hsm.admin_email,
          one_time_token: token,
          signature: make_signature(token),
          long_id: long_id
        }
      end

      private

      def path_prefix
        Rails.env.production? ? 'gra' : 'gra-test'
      end

      def format_token
        "#{Secrets.hsm_token}#{Time.zone.now.in_time_zone(8).strftime('%Y%m%d%H%M%S')}"
      end

      def make_signature(token)
        signature = Secrets.hsm_secret_key.sign(OpenSSL::Digest::SHA256.new, token)
        signature.unpack('H*').first
      end

      def build_help_message(envelope_info)
        return nil if envelope_info[:envelope_name].blank?
        "您正在為「#{envelope_info[:envelope_name]}」申請數位憑證以進行簽署作業。You are applying for a digital certificate to sign the document named \"#{envelope_info[:envelope_name]}\"."
      end

    end

  end
end
