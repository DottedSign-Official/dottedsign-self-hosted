class SystemCa < ApplicationRecord
  include Encryptable

  encryptable :pem

  has_many :access_rights, class_name: 'SystemCaAccessRight', dependent: :destroy
  has_many :members, through: :access_rights, source: :accessor, source_type: 'Member'
  belongs_to :group

  validates :cluster_id, :email, :pem, :token, presence: true

  def accessor_emails
    members.pluck(:email)
  end

  def cert_info
    token = format_token
    {
      cluster_id: cluster_id,
      email: email,
      one_time_token: token,
      signature: make_signature(token)
    }
  end

  private

  def format_token
    "#{token}#{Time.zone.now.in_time_zone(8).strftime('%Y%m%d%H%M%S')}"
  end

  def make_signature(token)
    secret_key = OpenSSL::PKey::RSA.new(pem)
    signature = secret_key.sign(OpenSSL::Digest::SHA256.new, token)
    signature.unpack('H*').first
  end
end
