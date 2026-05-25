module DigitalCertificate
  class Hsm
    REQUESTER = JsonRequester.new(Settings.hsm.host)
    CLUSTER_ID = Settings.hsm.system_cluster_id.freeze

    class << self

      def apply_user_cert(file_path, hsm_info)
        path_version = hsm_info[:path_version] || 'v1'
        path = Settings.hsm.path.send(path_version).user_cert.freeze
        params = {
          clusterid: CLUSTER_ID,
          uid: hsm_info[:long_id] || SecureRandom.uuid,
          b64pdf: Base64.strict_encode64(File.read(file_path)),
          thirdpartyclusterid: Settings.hsm.sign_cluster_id, # hsm make sure it's customer of kdan
          email: hsm_info[:email],
          tid: hsm_info[:tid] # receive from gra ca_request
        }
        REQUESTER.http_send(:post, path, params)
      end

      def apply_user_cert_with_password(file_path, doc_pass, hsm_info)
        path_version = hsm_info[:path_version] || 'v1'
        path = Settings.hsm.path.send(path_version).user_cert_with_password.freeze
        params = {
          clusterid: CLUSTER_ID,
          uid: hsm_info[:long_id] || SecureRandom.uuid,
          b64pdf: Base64.strict_encode64(File.read(file_path)),
          userpw: doc_pass,
          thirdpartyclusterid: Settings.hsm.sign_cluster_id,
          email: hsm_info[:email],
          tid: hsm_info[:tid]
        }
        REQUESTER.http_send(:post, path, params)
      end

      def apply_ap_cert(file_path, ap_info)
        path = Settings.hsm.path.v1.ap_cert.freeze
        params = {
          clusterid: CLUSTER_ID,
          uid: ap_info[:long_id] || SecureRandom.uuid,
          b64pdf: Base64.strict_encode64(File.read(file_path)),
          thirdpartyclusterid: ap_info[:cluster_id],
          email: ap_info[:email],
          apOneTimeToken: ap_info[:one_time_token],
          apSignature: ap_info[:signature]
        }
        REQUESTER.http_send(:post, path, params)
      end

      def apply_user_visible_cert(file_path, image_path, locate_info, hsm_info, b64pdf=nil)
        path_version = hsm_info[:path_version] || 'v1'
        path = Settings.hsm.path.send(path_version).user_visible_cert.freeze
        params = {
          clusterid: CLUSTER_ID,
          uid: hsm_info[:long_id] || SecureRandom.uuid,
          b64pdf: b64pdf || Base64.strict_encode64(File.read(file_path)),
          b64img: Base64.strict_encode64(File.read(image_path)),
          x: locate_info[:coord_x],
          y: locate_info[:coord_y],
          page: locate_info[:page],
          zoom: locate_info[:zoom],
          thirdpartyclusterid: Settings.hsm.sign_cluster_id, # hsm make sure it's customer of kdan
          email: hsm_info[:email],
          tid: hsm_info[:tid] # receive from gra ca_request
        }
        REQUESTER.http_send(:post, path, params)
      end

      def apply_ap_visible_cert(file_path, image_path, locate_info, ap_info, b64pdf=nil)
        path = Settings.hsm.path.v1.ap_visible_cert.freeze
        params = {
          clusterid: CLUSTER_ID,
          uid: ap_info[:long_id] || SecureRandom.uuid,
          b64pdf: b64pdf || Base64.strict_encode64(File.read(file_path)),
          b64img: Base64.strict_encode64(File.read(image_path)),
          thirdpartyclusterid: ap_info[:cluster_id],
          email: ap_info[:email],
          apOneTimeToken: ap_info[:one_time_token],
          apSignature: ap_info[:signature],
          page: locate_info[:page],
          x: locate_info[:coord_x],
          y: locate_info[:coord_y],
          zoom: locate_info[:zoom]
        }
        REQUESTER.http_send(:post, path, params)
      end

    end
  end
end
