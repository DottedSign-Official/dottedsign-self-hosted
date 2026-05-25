class Member < ApplicationRecord
  self.default_scope { includes(nil) }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :validatable, :auth_identitable

  has_one :profile, dependent: :destroy
  has_many :contacts, dependent: :destroy
  has_many :sign_tasks, foreign_key: :owner_id, dependent: :destroy
  has_many :signatures, dependent: :destroy
  has_many :templates, foreign_key: :owner_id, dependent: :destroy
  has_many :public_forms, foreign_key: :owner_id, dependent: :destroy

  belongs_to :group, optional: true
  has_many :group_invites, dependent: :destroy
  has_many :member_roles, dependent: :destroy
  has_many :roles, through: :member_roles
  has_many :current_roles, ->(member) { where('roles.group_id = ?', member.group_id) }, through: :member_roles, source: :role

  acts_as_tagger
  acts_as_taggable

  scope :registered, -> { where(is_registered: true) }
  scope :temp, -> { where(is_registered: false) }

  after_commit :create_profile, on: :create
  after_commit :send_confirmation_instructions, on: :update, if: :register_from_temp?
  after_commit :first_time_confirm, on: :update, if: :confirmed_at_previously_changed?
  after_commit :send_verify_change_mail, on: :update, if: :preferences_previously_changed?

  has_one :avatar, -> { uploaded.where(label: 'avatar') }, as: :storable, class_name: 'ServiceFile'

  enum status: [:active, :inactive]

  prepend ::Groupable
  include Info
  include Preference
  include ShareStorable
  include Groupable
  include ExternalMappable
  include SystemCaAccessor
  include DeviseMethods

  PER_PAGE = 10

  class << self

    def register(register_info)
      member = Member.find_or_initialize_by(email: register_info[:email])
      member if member.register(password: register_info[:password], name: register_info[:name])
    end

    def setup_member(email, name = nil)
      member = Member.find_or_initialize_by(email: email)
      return member unless member.new_record?
      member.name ||= name
      member.password = Secrets.default_password
      member.skip_confirmation!
      member if member.save
    end

    def matched_ids(terms)
      where("name ILIKE ? OR email ILIKE ?", "%#{terms}%", "%#{terms}%").pluck(:id)
    end

  end

  def register(password:, name: '')
    self.password = password
    self.name = name if name.present?
    self.is_registered = true
    self.save
  end

  def access_token_for(app, scopes = '', reuse_token = false)
    if reuse_token
      access_token = Doorkeeper::AccessToken.matching_token_for(app.id, id, scopes)
      return access_token if access_token.present? && !access_token.expired?
    end
    expires_in = Doorkeeper.configuration.access_token_expires_in
    use_refresh_token = Doorkeeper.configuration.refresh_token_enabled?
    Doorkeeper::AccessToken.find_or_create_for(application: app, resource_owner: self, scopes: scopes, expires_in: expires_in, use_refresh_token: use_refresh_token)
  end

  def admin?
    email.match?(Settings.admin_regex)
  end

  def increase_monthly_task_usage!
    self.increment!(:monthly_task_usage)
  end

  def first_time_confirm
    return if confirmed_at_before_last_save.present?
    MailCenter.delay.raise_if_server_failed('welcome', email, display_name, profile.language)
  end

  def tag_list_with_order(context = 'tags', search_tag_name: nil)
    tag_list = []
    ActsAsTaggableOn::Tagging.list_with_sequence(taggable_type: 'Member', taggable_id: id, context: context) do |tagging, tag|
      next if search_tag_name.present? && !/#{search_tag_name}/.match?(tag.name)
      tag_list << tag.name
    end
    tag_list
  end

  def super_admin?
    SuperAdmin.include?(email)
  end

  def icon_url
    profile&.display_icon_url || Profile.default_icon_url
  end

  def active_group_id
    return if group.nil?

    group.active? ? group_id : nil
  end

  private

  def create_profile
    self.create_profile!(icon_url: Profile.default_icon_url)
  end

  def register_from_temp?
    is_registered_previously_changed? && is_registered
  end

  MAIL_NOTIFY_FIELDS = %w[otp_via_email otp_via_phone phone_number].freeze

  def send_verify_change_mail
    old_preference, new_preference = preferences_previous_change
    change_preferences = (new_preference.to_a - old_preference.to_a).to_h
    mail_change_preferences = change_preferences.slice(*MAIL_NOTIFY_FIELDS)
    change_time = "#{Time.zone.now.strftime('%Y-%m-%d %H:%M:%S')} UTC"
    return if mail_change_preferences.blank?
    MailCenter.delay.raise_if_server_failed('verify_method_changed', email, display_name, change_time, mail_change_preferences, profile.language)
  end

end
