module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :room_id

    def connect
      self.room_id = room_id
    end

    protected

    def room_id
      access_token = request.query_parameters['access_token']
      code = request.query_parameters['code']
      current_member = fetch_member_by_token(access_token)
      return current_member.id if current_member.present?
      return code if verify_preview_code(code)

      reject_unauthorized_connection
    end

    def fetch_member_by_token(access_token)
      token = Doorkeeper::AccessToken.find_by_token(access_token)
      return if token.blank?

      current_member = Member.find_by_id(token.resource_owner_id)
      return if current_member.blank?

      current_member
    end

    def verify_preview_code(code)
      return false unless code.present?
      code = Base64.urlsafe_decode64(code) if code.base64?
      code_info, header = JWT.decode(code, Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm }) rescue code_info = nil
      return false unless code_info.present?
      return false if code_info['expired_at'].present? && code_info['expired_at'] < Time.now.to_i

      if code_info['email'].present?
        current_member = Member.find_by_email(code_info['email'])
        return false if current_member.nil?
      end
      true
    end


  end
end
