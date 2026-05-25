class Group < ApplicationRecord
  class << self
    def default
      @default ||= find_by(name: Settings.default_group.name)
    end
  end

  include AASM
  include ShareStorable

  has_one :icon, -> { uploaded.where(label: 'icon') }, as: :storable, class_name: 'ServiceFile'
  has_one :basic_role, -> { where(name: 'member') }, class_name: 'Role'
  has_many :members
  has_many :system_cas
  has_many :share_settings, as: :target
  has_many :service_files, as: :storable
  has_many :roles, dependent: :destroy
  has_many :group_invites, dependent: :destroy
  has_many :group_decline_reasons
  has_many :decline_reasons, through: :group_decline_reasons

  before_create :setup_unique_name
  after_create :setup_roles

  enum status: [:active, :suspend, :dead]

  PER_PAGE = 10

  aasm column: :status, enum: true do
    state :active, initial: true
    state :suspend
    state :dead

    event :reactive do
      transitions from: :suspend, to: :active, after: :append_group_id
    end

    event :pause do
      transitions from: :active, to: :suspend, after: :clean_group_id
    end

    event :disband do
      transitions from: [:active, :suspend], to: :dead, after: :clean_group_id
    end
  end

  def display(show_members: true)
    methods = show_members ? [:group_members] : []
    info = as_json(only: [:id, :name, :unique_name, :status], methods: methods)
    info['icon_url'] = display_icon_url
    info['admin_infos'] = admin_members.map { |member| { name: member.display_name, email: member.email } }
    info
  end

  def group_members
    group_invites.includes(member: :roles).map do |invite|
      {
        name: invite.member.display_name,
        email: invite.member.email,
        status: invite.status,
        roles: invite.member.roles.select { |role| role.group_id == id }.pluck(:name)
      }
    end
  end

  def add_member(member)
    raise ServiceError.new(:already_in_group) if member.group_id == id
    raise ServiceError.new(:already_in_other_group) if member.group_id.present?

    invite = group_invites.find_by(member_id: member.id)
    if invite.present?
      invite.reinvite! unless invite.waiting?
      invite.send(:send_invite_mail) if invite.waiting?
    else
      invite = group_invites.create(member_id: member.id)
      raise ServiceError.new(:invite_failed, invite.errors.full_messages) if invite.errors.present?
    end

    invite
  end

  def remove_member(member)
    invite = group_invites.find_by_member_id(member.id)
    raise ServiceError.new(:member_not_invited_yet) if invite.nil?
    invite.revoke!
    SystemCaAccessRight.where(accessor: member).destroy_all
  end

  def assign_role(member, role_names)
    raise ServiceError.new(:group_not_belong) unless member.group_id == id
    new_roles = roles.where(name: role_names)
    raise ServiceError.new(:role_not_exist) if new_roles.blank?
    admin_member_ids = admin_members.pluck(:id)
    raise ServiceError.new(:group_need_one_admin) if admin_member_ids.include?(member.id) && role_names.exclude?('admin') && admin_member_ids.length < 2
    member_roles = []
    ActiveRecord::Base.transaction do
      MemberRole.where(member_id: member.id, role_id: roles.pluck(:id)).destroy_all
      member_roles = new_roles.map do |new_role|
        mr = MemberRole.create(member_id: member.id, role_id: new_role.id)
        new_role.name if mr.errors.blank?
      end
      raise ServiceError.new(:assign_failed) if member_roles.blank?
    end
    member_roles
  end

  def permission_info
    roles.order(:id).as_json(only: [:name, :permission])
  end

  def admin_members
    members.joins(member_roles: :role).where(roles: { name: 'admin', group_id: id })
  end

  def display_icon_url
    icon_url % { server_host: Settings.host } if icon_url.present?
  end

  def active_system_and_group_decline_reasons
    DeclineReason.active_system_reserved + decline_reasons.active
  end

  def custom_roles
    roles.pluck(:name) - Settings.default.permissions.keys
  end

  private

  def setup_unique_name
    loop do
      self.unique_name = SecureRandom.uuid
      break if Group.find_by_unique_name(unique_name).nil?
    end
  end

  def setup_roles
    Settings.default.permissions.each_pair do |role, permission|
      roles.create(name: role, permission: permission, priority: Settings.default.role_priority[role])
    end
  end

  def append_group_id
    Member.joins(:group_invites).where(group_invites: { status: 'accepted' }).update_all(group_id: id)
  end

  def clean_group_id
    members.update_all(group_id: nil)
  end

end
