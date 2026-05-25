class GroupInvite < ApplicationRecord
  include AASM

  belongs_to :group
  belongs_to :member

  INVITE_EXPIRED_IN = 2.days.to_i

  after_commit :send_invite_mail, on: :create

  enum status: [:waiting, :accepted, :removed, :canceled, :disabled]

  aasm column: :status, enum: true do
    state :waiting, initial: true, after_enter: [:send_invite_mail]
    state :accepted
    state :removed, after_enter: [:send_cancel_mail]
    state :canceled, after_enter: [:send_cancel_mail]
    state :disabled

    event :reinvite do
      transitions from: [:removed, :canceled], to: :waiting
      transitions from: :disabled, to: :waiting, if: :member_can_be_invited?
    end

    event :accept do
      transitions from: :waiting, to: :accepted, after: Proc.new { set_member_role && disable_other_invites && confirm_member }, guards: [:member_ready?]
    end

    event :revoke do
      transitions from: :accepted, to: :removed, success: :remove_group_id
      transitions from: :waiting, to: :canceled
    end
  end

  def invite_token
    payload = {
      invite_id: id,
      expired_at: Time.zone.now.to_i + INVITE_EXPIRED_IN
    }
    JWT.encode(payload, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
  end

  private

  def set_member_role
    member.update(group_id: group_id)
    return if MemberRole.find_by(member_id: member_id, role_id: group.roles.pluck(:id)).present?
    MemberRole.create(member_id: member_id, role_id: group.basic_role.id)
  end

  def disable_other_invites
    GroupInvite.where.not(id: id).where(member_id: member_id).update_all(status: :disabled)
  end

  def confirm_member
    member.confirm unless member.confirmed?
  end

  def remove_group_id
    member.update(group_id: nil)
    MemberRole.where(member_id: member.id).destroy_all
  end

  def member_can_be_invited?
    member.group_id.nil?
  end

  def member_ready?
    member.group_id.nil? && member.is_registered
  end

  def send_invite_mail
    MailCenter.delay.raise_if_server_failed('group_invite', member.email, invite_token, member.profile.language)
  end

  def send_cancel_mail
    MailCenter.delay.raise_if_server_failed('group_cancel', group.admin_members.pluck(:email).first,  member.email, member.profile.language)
  end
end
