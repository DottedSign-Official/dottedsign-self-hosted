import toast from "../../constants/toast";

const data = {
  [toast.taskDeleteSuc]: {
    text: "task_del_suc",
  },
  [toast.taskDeleteFal]: {
    text: "task_del_fal",
    isWarning: true,
  },
  [toast.taskDeleteProhibited]: {
    text: "task_del_prohibited",
    isWarning: true,
  },

  [toast.accountUpdateSuc]: {
    text: "account_update_suc",
  },
  [toast.accountUpdateFal]: {
    icon: "/static/icons/ic-warning.svg",
    isWarning: true,
    text: "account_update_fal",
  },

  [toast.updatePasswordSuc]: {
    text: "account_update_suc",
  },
  [toast.updatePasswordFal]: {
    isWarning: true,
  },
  [toast.updatePasswordFalWrong]: {
    text: "password_not_match",
    isWarning: true,
  },
  [toast.updatePasswordFalTheSame]: {
    text: "password_same_as_last_modification",
    isWarning: true,
  },
  [toast.updatePasswordFalInconsistent]: {
    text: "password_and_confirmation_not_match",
    isWarning: true,
  },

  [toast.profileUpdateSuc]: {
    text: "profile_update_suc",
  },
  [toast.profileUpdateFal]: {
    text: "profile_update_fal",
    isWarning: true,
  },

  [toast.signSaveSuc]: {
    text: "sign_save_suc",
  },
  [toast.signSaveFal]: {
    text: "sign_save_fal",
    isWarning: true,
  },

  [toast.signSaveAlreadyExist]: {
    text: "sign_save_already_exist",
    isWarning: true,
  },

  [toast.signOversize]: {
    text: "sign_oversize",
    isWarning: true,
  },

  [toast.signDeleteSuc]: {
    text: "sign_del_suc",
  },
  [toast.signDeleteFal]: {
    text: "sign_del_fal",
    isWarning: true,
  },
  [toast.signDeleteAlreadyDelete]: {
    text: "sign_del_already_delete",
    isWarning: true,
  },

  [toast.getEmailOutSuc]: {
    text: "email_sent_suc",
  },
  [toast.getEmailOutFal]: {
    text: "email_sent_fal",
    isWarning: true,
  },

  [toast.sentReminderSuc]: {
    text: "reminder_sent_suc",
  },
  [toast.sentReminderFal]: {
    text: "reminder_sent_fal",
    isWarning: true,
  },

  [toast.preferenceUpdateSuc]: {
    text: "preference_update_suc",
  },
  [toast.preferenceUpdateFal]: {
    text: "preference_update_fal",
    isWarning: true,
  },

  [toast.avatarUploadSuc]: {
    text: "avatar_upload_suc",
  },
  [toast.avatarUploadFal]: {
    text: "avatar_upload_fal",
    isWarning: true,
  },

  [toast.avatarChangeSuc]: {
    text: "avatar_change_suc",
  },
  [toast.avatarChangeFal]: {
    text: "avatar_change_fal",
    isWarning: true,
  },

  [toast.putFileNameSuc]: {
    text: "file_name_change_suc",
  },
  [toast.putFileNameFal]: {
    text: "file_name_change_fal",
    isWarning: true,
  },

  [toast.fileFormatError]: {
    text: "file_format_error",
    isWarning: true,
  },

  [toast.imgFormatError]: {
    text: "img_format_error",
    isWarning: true,
  },

  [toast.commonFormatError]: {
    text: "common_format_error",
    isWarning: true,
  },

  [toast.emailFormatError]: {
    text: "email_format_error",
    isWarning: true,
  },

  [toast.emailDomainError]: {
    text: "email_domain_error",
    isWarning: true,
  },

  [toast.filePasswordProtected]: {
    text: "file_password_protected",
    isWarning: true,
  },

  [toast.draftSuc]: {
    text: "draft_suc",
  },
  [toast.revertDraftFal]: {
    text: "revert_draft_fal",
    isWarning: true,
  },
  [toast.createSuc]: {
    text: "create_suc",
  },
  [toast.overLimit]: {
    text: "over_limit",
    isWarning: true,
  },

  [toast.sendRequestSuc]: {
    text: "send_request_suc",
  },
  [toast.sendRequestFal]: {
    text: "send_request_fal",
    isWarning: true,
  },
  [toast.putDraftSuc]: {
    text: "put_draft_suc",
  },

  [toast.checkFal]: {
    text: "check_fal",
    isWarning: true,
  },
  [toast.publicFormCheckFal]: {
    text: "public_form_check_fal",
    isWarning: true,
  },
  [toast.notEmail]: {
    text: "not_email",
    isWarning: true,
  },
  [toast.verifyInvalid]: {
    text: "verify_invalid",
    isWarning: true,
  },
  [toast.ccFailed]: {
    text: "cc_failed",
    isWarning: true,
  },
  [toast.noAssigne]: {
    text: "no_assigne",
    isWarning: true,
  },
  [toast.noFields]: {
    text: "no_fields",
    isWarning: true,
  },
  [toast.ccHasEmpty]: {
    text: "cc_has_empty_value",
    isWarning: true,
  },
  [toast.ccHasDuplicateEmail]: {
    text: "cc_has_duplicate_email",
    isWarning: true,
  },
  [toast.envelopeAtLeastOneField]: {
    text: "envelope_at_least_one_field",
    isWarning: true,
  },
  [toast.assigneFal]: {
    text: "assigne_fal",
    isWarning: true,
  },
  [toast.setCcsFal]: {
    text: "set_ccs_fal",
    isWarning: true,
  },
  [toast.postDraftFal]: {
    text: "post_draft_fal",
    isWarning: true,
  },
  [toast.postCreateFal]: {
    text: "post_create_fal",
    isWarning: true,
  },
  [toast.putDraftFal]: {
    text: "put_draft_fal",
    isWarning: true,
  },
  [toast.commonDraftError]: {
    text: "common_draft_error",
    isWarning: true,
  },

  [toast.postSetupSuc]: {
    text: "post_setup_suc",
  },
  [toast.postSetupFal]: {
    text: "post_setup_fal",
    isWarning: true,
  },

  [toast.otpResendSuc]: {
    text: "post_otp_resend_suc",
  },
  [toast.otpResendFal]: {
    text: "post_otp_resend_fal",
    isWarning: true,
  },

  [toast.postSignAndSendSuc]: {
    text: "post_sign_and_send_suc",
  },
  [toast.postSignAndSendFal]: {
    text: "post_sign_and_send_fal",
    isWarning: true,
  },

  [toast.postTemplateSuc]: {
    text: "post_template_suc",
  },
  [toast.postTemplateFal]: {
    text: "post_template_fal",
    isWarning: true,
  },

  [toast.putTemplateSuc]: {
    text: "put_template_suc",
  },
  [toast.putTemplateFal]: {
    text: "put_template_fal",
    isWarning: true,
  },
  [toast.templateNotAccessible]: {
    text: "template_not_accessible",
    isWarning: true,
  },

  [toast.postInviteSignResendSuc]: {
    text: "post_invite_sign_resend_suc",
  },
  [toast.postInviteSignResendFal]: {
    text: "post_invite_sign_resend_fal",
    isWarning: true,
  },

  [toast.postNotifySenderSuc]: {
    text: "post_notify_sender_suc",
  },
  [toast.postNotifySenderFal]: {
    text: "post_notify_sender_fal",
    isWarning: true,
  },
  [toast.postChangeOwnerSuc]: {
    text: "post_change_owner_suc",
  },
  [toast.postChangeOwnerFal]: {
    text: "post_change_owner_fal",
    isWarning: true,
  },
  [toast.putChangeSignerSuc]: {
    text: "post_change_signer_suc",
  },
  [toast.putChangeSignerFal]: {
    text: "post_change_signer_fal",
    isWarning: true,
  },

  [toast.unchangedSigner]: {
    text: "unchanged_signer",
    isWarning: true,
  },
  [toast.duplicatedSigner]: {
    text: "duplicated_signer",
    isWarning: true,
  },
  [toast.invalidTask]: {
    text: "invalid_task",
    isWarning: true,
  },
  [toast.stageAlreadyDone]: {
    text: "stage_already_done",
    isWarning: true,
  },

  [toast.invalidPhone]: {
    text: "invalid_phone",
    isWarning: true,
  },
  [toast.invalidSeal]: {
    text: "invalid_seal",
  },

  [toast.declineToSignSuc]: {
    text: "decline_to_sign_suc",
  },
  [toast.declineToSignFal]: {
    text: "decline_to_sign_fal",
    isWarning: true,
  },
  [toast.messageError]: {
    text: "message_error",
    isWarning: true,
  },
  [toast.postInviteSignResendFalEmailBounced]: {
    text: "post_invite_sign_resend_fal_email_bounced",
    isWarning: true,
  },

  [toast.putOrganizationLogoFal]: {
    text: "put_organization_logo_fal",
    isWarning: true,
  },
  [toast.putOrganizationFal]: {
    text: "put_organization_fal",
    isWarning: true,
  },
  [toast.putOrganizationSuc]: {
    text: "put_organization_suc",
  },
  [toast.putPermissionsFal]: {
    text: "put_permissions_fal",
    isWarning: true,
  },
  [toast.putPermissionsSuc]: {
    text: "put_permissions_suc",
  },

  [toast.delTemplateSuc]: {
    text: "del_template_suc",
  },
  [toast.delTemplateFal]: {
    text: "del_template_fal",
    isWarning: true,
  },

  [toast.getTemplateFal]: {
    text: "get_template_fal",
    isWarning: true,
  },

  [toast.getTemplatesFailed]: {
    text: "get_templates_fal",
    isWarning: true,
  },
  [toast.getLabelsFailed]: {
    text: "get_labels_fal",
    isWarning: true,
  },
  [toast.createLabelFailed]: {
    text: "create_label_fal",
    isWarning: true,
  },
  [toast.putLabelFal]: {
    text: "put_label_fal",
    isWarning: true,
  },
  [toast.delLabelFailed]: {
    text: "del_label_fal",
    isWarning: true,
  },
  [toast.labelDuplicatedFailed]: {
    text: "label_duplicated_fal",
    isWarning: true,
  },
  [toast.labelTooLongFailed]: {
    text: "label_too_long_fal",
    isWarning: true,
  },
  [toast.manageLabelSuc]: {
    text: "manage_label_suc",
  },
  [toast.overLimitTask]: {
    text: "over_limit_task",
    isWarning: true,
  },
  [toast.overLimitSigner]: {
    text: "over_limit_signer",
    isWarning: true,
  },
  [toast.overLimitAttachment]: {
    text: "over_limit_attachment",
    isWarning: true,
  },

  [toast.overLimitReference]: {
    text: "over_limit_reference",
    isWarning: true,
  },

  [toast.uploadFailed]: {
    text: "upload_failed",
    isWarning: true,
  },
  [toast.fileOversize]: {
    text: "file_oversize",
    isWarning: true,
  },
  [toast.totalFileOversize]: {
    text: "total_file_oversize",
    isWarning: true,
  },

  [toast.otpSourceNotSet]: {
    text: "otp_source_not_set",
    isWarning: true,
  },

  [toast.templateNotFound]: {
    text: "template_not_found",
    isWarning: true,
  },
  [toast.templateDeleted]: {
    text: "template_deleted",
    isWarning: true,
  },
  [toast.templateAccessDenied]: {
    text: "template_access_denied",
    isWarning: true,
  },
  [toast.templateNotSharable]: {
    text: "template_not_sharable",
    isWarning: true,
  },
  [toast.putTemplateShareSuc]: {
    text: "put_template_share_suc",
  },
  [toast.deleteTemplateShareSuc]: {
    text: "delete_template_share_suc",
  },
  [toast.deleteTemplateShareFal]: {
    text: "delete_template_share_fal",
    isWarning: true,
  },
  [toast.sharedTemplateHasOtherGroups]: {
    text: "shared_template_has_other_groups",
    isWarning: true,
  },
  [toast.duplicateTemplateCode]: {
    text: "duplicate_template_code",
    isWarning: true,
  },

  [toast.templateWithInvalidStage]: {
    text: "template_with_invalid_stage",
    isWarning: true,
  },
  [toast.templateInvalidWithEditor]: {
    text: "template_invalid_with_editor",
    isWarning: true,
  },
  [toast.csvFetchFailed]: {
    text: "csv_fetch_failed",
    isWarning: true,
  },
  [toast.wrongCsvFile]: {
    text: "wrong_csv_file",
    isWarning: true,
  },
  [toast.wrongCsvContent]: {
    text: "wrong_csv_content",
    isWarning: true,
  },
  [toast.csvOverLimit]: {
    text: "csv_over_limit",
    isWarning: true,
  },
  [toast.postBulkSuc]: {
    text: "post_bulk_suc",
  },
  [toast.postBulkFal]: {
    text: "post_bulk_fal",
    isWarning: true,
  },

  [toast.popupNotSupported]: {
    text: "popup_not_supported",
    isWarning: true,
  },
  [toast.fetchDraftFal]: {
    text: "fetch_draft_fal",
    isWarning: true,
  },
  [toast.notDraft]: {
    text: "not_draft",
    isWarning: true,
  },
  [toast.systemCaDelSuc]: {
    text: "system_ca_del_suc",
  },
  [toast.systemUpdateFal]: {
    isWarning: true,
    text: "system_ca_update_fal",
  },
  [toast.caMemberFal]: {
    text: "ca_member_fal",
    isWarning: true,
  },

  [toast.commonError]: {
    text: "common_error",
    isWarning: true,
  },
  [toast.checkMailFal]: {
    text: "check_mail_fal",
    isWarning: true,
  },
  [toast.loginFal]: {
    text: "login_fal",
    isWarning: true,
  },
  [toast.resetFal]: {
    text: "token_invalid",
    isWarning: true,
  },
  [toast.registerFal]: {
    text: "register_fal",
    isWarning: true,
  },
  [toast.invalidDomain]: {
    text: "invalidDomain",
    isWarning: true,
  },
  [toast.dynamicError]: {
    isWarning: true,
  },

  [toast.inviteeSuc]: {
    text: "invitee_suc",
  },
  [toast.inviteeFal]: {
    text: "invitee_fal",
    isWarning: true,
  },
  [toast.inviterGroupOverLimit]: {
    text: "inviter_group_over_limit",
    isWarning: true,
  },
  [toast.inviteeAlreadyInGroup]: {
    text: "inviter_already_in_group",
    isWarning: true,
  },
  [toast.delGroupSuc]: {
    text: "del_group_suc",
  },
  [toast.frontDeskTemplateError]: {
    text: "front_desk_template_error",
    isWarning: true,
  },
  [toast.putSignSuc]: {
    text: "put_sign_suc",
  },
  [toast.duplicatedRoleName]: {
    text: "duplicate_role_name_error",
    isWarning: true,
  },
  [toast.invalidEmail]: {
    text: "email_invalid",
    isWarning: true,
  },
  [toast.updateMemberStatusSuc]: {
    text: "update_member_status_suc",
  },
  [toast.lessThanTemplatePages]: {
    text: "less_than_template_pages",
    isWarning: true,
  },
  [toast.sizeMismatch]: {
    text: "size_mismatch",
    isWarning: true,
  },
  [toast.socketReconnectFailed]: {
    text: "socket_reconnect_failed",
    isWarning: true,
  },
  [toast.unmatchedSystemCA]: {
    text: "unmatched_system_ca",
  },
  [toast.signatureNotFound]: {
    text: "signature_not_found",
    isWarning: true,
  },
  [toast.postReissueTaskSuc]: {
    text: "reissue_task_suc",
  },
  [toast.postReissueTaskFal]: {
    text: "reissue_task_fal",
    isWarning: true,
  },
  [toast.systemCAFailed]: {
    text: "system_ca_failed",
    isWarning: true,
  },
  [toast.templateReplaceFileInfoSuc]: {
    text: "template_replace_file_info_suc",
  },
  [toast.postDuplicateSignTaskSuc]: {
    text: "post_duplicate_sign_task_suc",
  },
  [toast.postDuplicateSignTaskFal]: {
    text: "post_duplicate_sign_task_fal",
    isWarning: true,
  },

  [toast.duplicateTemplateSuc]: {
    text: "duplicate_template_suc",
  },
  [toast.duplicateTemplateFal]: {
    text: "duplicate_template_fal",
    isWarning: true,
  },
  [toast.saveAsTemplateSuc]: {
    text: "save_as_template_suc",
  },
  [toast.saveAsTemplateFal]: {
    text: "save_as_template_fal",
    isWarning: true,
  },
  [toast.postCheckSuc]: {
    text: "post_check_suc",
  },
  [toast.postCheckFal]: {
    text: "post_check_fal",
    isWarning: true,
  },
  [toast.postReviewSuc]: {
    text: "post_review_suc",
  },
  [toast.postReviewFal]: {
    text: "post_review_fal",
    isWarning: true,
  },

  [toast.postSigningGroupSuc]: {
    text: "post_signing_group_suc",
  },
  [toast.putSigningGroupSuc]: {
    text: "put_signing_group_suc",
  },
  [toast.delSigningGroupSuc]: {
    text: "del_signing_group_suc",
  },
  [toast.postShareSigningGroupSuc]: {
    text: "post_share_signing_group_suc",
  },
  [toast.importSigningGroupSuc]: {
    text: "import_signing_group_suc",
  },
  [toast.importSigningGroupFalTemplate]: {
    text: "import_signing_group_fal_template",
    isWarning: true,
  },
  [toast.importSigningGroupFalRole]: {
    text: "import_signing_group_fal_role",
    isWarning: true,
  },
  [toast.invalidName]: {
    text: "invalid_name",
    isWarning: true,
  },
  [toast.invalidSigner]: {
    text: "invalid_signer",
    isWarning: true,
  },

  [toast.deletePublicFormSuc]: {
    text: "delete_public_form_suc",
  },
  [toast.deletePublicFormFal]: {
    text: "delete_public_form_fal",
    isWarning: true,
  },
  [toast.postPublicFormSuc]: {
    text: "post_public_form_suc",
  },
  [toast.postPublicFormFal]: {
    text: "post_public_form_fal",
    isWarning: true,
  },
  [toast.savePublicFormSuc]: {
    text: "save_public_form_suc",
  },
  [toast.savePublicFormFal]: {
    text: "save_public_form_fal",
    isWarning: true,
  },
  [toast.putPublicFormSuc]: {
    text: "put_public_form_suc",
  },
  [toast.putPublicFormFal]: {
    text: "put_public_form_fal",
    isWarning: true,
  },
  [toast.overLimitPublicForm]: {
    text: "over_limit_public_form",
    isWarning: true,
  },
  [toast.getPublicFormFal]: {
    text: "get_public_form_fal",
    isWarning: true,
  },
  [toast.publishSuc]: {
    text: "publish_suc",
  },
  [toast.unpublishSuc]: {
    text: "unpublish_suc",
  },
  [toast.signerInfoError]: {
    text: "signer_info_error",
    isWarning: true,
  },
  [toast.publicFormInvalid]: {
    text: "public_form_invalid",
    isWarning: true,
  },
  [toast.publicFormSignFal]: {
    text: "public_form_sign_fal",
    isWarning: true,
  },
  [toast.publicFormDeleted]: {
    text: "public_form_deleted",
    isWarning: true,
  },
  [toast.publicFormTemplateModified]: {
    text: "public_form_template_modified",
    isWarning: true,
  },
  [toast.publicFormReachTarget]: {
    text: "public_form_reach_target",
    isWarning: true,
  },
  [toast.publicFormCheckerNotSupport]: {
    text: "public_form_checker_not_support",
    isWarning: true,
  },
  [toast.publicFormSignerOrderError]: {
    text: "public_form_signer_order_error",
    isWarning: true,
  },
  [toast.publicFormReachLimit]: {
    text: "public_form_reach_limit",
    isWarning: true,
  },
  [toast.publicFormOwnerReachLimit]: {
    text: "public_form_owner_reach_limit",
    isWarning: true,
  },
  [toast.publicFormTemplateError]: {
    text: "public_form_template_error",
    isWarning: true,
  },
  [toast.putPublicFormCompressSuc]: {
    text: "put_public_form_compress_suc",
  },
  [toast.putPublicFormCompressFalProcessing]: {
    text: "put_public_form_compress_fal_processing",
    isWarning: true,
  },
  [toast.putPublicFormCompressFalInvalid]: {
    text: "put_public_form_compress_fal_invalid",
    isWarning: true,
  },
  [toast.copyPublicFormLinkSuc]: {
    text: "public_form_link_copied",
  },

  [toast.readOnlyUnselected]: {
    text: "read_only_unselected",
    isWarning: true,
  },
};
export default data;
