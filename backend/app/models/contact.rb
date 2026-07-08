class Contact < ApplicationRecord
  belongs_to :member

  before_save :check_contact_info
  validates :email, uniqueness: { scope: :member_id, case_sensitive: false }
  class << self

    def setup_for_member(member_id, contact_info)
      normalized_email = contact_info[:email].to_s.downcase
      contact = find_or_initialize_by(member_id: member_id, email: normalized_email)
      contact.assign_attributes(contact_info.slice(*Contact.column_names.map(&:to_sym)).merge(email: normalized_email))
      contact.save
    end

    def basic_infos
      all.map do |contact|
        contact.basic_info
      end
    end

  end

  def basic_info
    as_json(only: [:email, :name, :phone])
  end

  private

  def check_contact_info
    self.email.downcase!
    self.name ||= email.split('@').first
  end
end
