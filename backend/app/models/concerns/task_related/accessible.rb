module TaskRelated::Accessible
  extend ActiveSupport::Concern

  KEY_ACTION_MAP = {
    view: 'view_task',
    sign: 'sign_the_task',
    review: 'review_task',
    decline: 'decline_task',
    confirm: 'confirm_task',
    change_signer: 'change_signer',
    change_signer_request: 'view_task', # use the same check as view_task
    download_task: 'download_task',
    download_audit_trail: 'download_audit_trail',
    download_attachment: 'download_attachment',
    reissue: 'reissue_task',
    delete: 'delete_task',
    change_owner: 'change_owner'
  }.freeze

  def accessibility_of(member, check_action = 'view_task', check_stage: nil)
    checker_class = "AccessCheck::#{check_action.camelize}".safe_constantize || AccessCheck::General
    checker = checker_class.call(self, member, check_action: check_action, check_stage: check_stage)
    return checker.result if checker.success?
    checker.error.key
  end

  def access_info(member, check_stage: nil, actions: [*KEY_ACTION_MAP.keys])
    KEY_ACTION_MAP.slice(*actions).map.each_with_object({}) do |(key, action), hash|
      hash[key] = accessibility_of(member, action, check_stage: check_stage)
    end
  end
end
