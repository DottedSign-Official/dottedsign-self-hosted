# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2025_12_04_154306) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bulk_missions", force: :cascade do |t|
    t.string "uuid", null: false
    t.integer "template_id", null: false
    t.integer "owner_id", null: false
    t.integer "count", default: 0
    t.integer "status", default: 0
    t.json "client_info", default: {}
    t.json "setting_info", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uuid"], name: "index_bulk_missions_on_uuid"
  end

  create_table "ca_retries", force: :cascade do |t|
    t.integer "service_file_id", null: false
    t.integer "retry_count", default: 0
    t.string "error_message"
    t.integer "status", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "callbacks", force: :cascade do |t|
    t.integer "source_id", null: false
    t.integer "event", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "source_type", default: "SignTask"
    t.index ["source_id"], name: "index_callbacks_on_source_id"
  end

  create_table "combinations", force: :cascade do |t|
    t.string "name"
    t.integer "owner_id"
    t.integer "group_id"
    t.integer "quantity"
    t.string "description"
    t.boolean "has_order", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_id"], name: "index_combinations_on_owner_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.integer "member_id", null: false
    t.string "email", null: false
    t.string "name"
    t.string "phone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["member_id", "email"], name: "index_contacts_on_member_id_and_email"
    t.index ["member_id"], name: "index_contacts_on_member_id"
  end

  create_table "country_infos", force: :cascade do |t|
    t.string "name"
    t.string "alpha2"
    t.string "alpha3"
    t.string "calling_code"
    t.json "translations", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "decline_logs", force: :cascade do |t|
    t.integer "sign_task_id", null: false
    t.integer "sign_stage_id", null: false
    t.integer "sign_event_id", null: false
    t.string "reason"
    t.json "reply_to"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "decline_reason_id"
    t.string "message"
    t.index ["sign_event_id"], name: "index_decline_logs_on_sign_event_id"
    t.index ["sign_stage_id"], name: "index_decline_logs_on_sign_stage_id"
    t.index ["sign_task_id"], name: "index_decline_logs_on_sign_task_id"
  end

  create_table "decline_reasons", force: :cascade do |t|
    t.integer "status", default: 0
    t.boolean "system_reserved", default: false
    t.string "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "dummy_stages", force: :cascade do |t|
    t.string "source_type"
    t.integer "source_id"
    t.integer "sequence"
    t.integer "actor_id"
    t.json "actor_info", default: {}
    t.json "pdf_object_info"
    t.json "attachment_setting", default: []
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.json "custom_message_setting", default: {}
    t.string "action", default: "sign"
    t.index ["source_type", "source_id"], name: "index_dummy_stages_on_source_type_and_source_id"
  end

  create_table "envelope_settings", force: :cascade do |t|
    t.bigint "envelope_id", null: false
    t.boolean "forget_remind", default: false
    t.datetime "deadline"
    t.datetime "expire_remind_at"
    t.text "message"
    t.text "completed_message"
    t.boolean "need_otp_verify", default: false
    t.boolean "inform_enable", default: true
    t.string "receiver_lang", default: "zh-TW"
    t.json "cc_info", default: []
    t.json "reference_setting", default: []
    t.json "completed_reference_setting", default: []
    t.boolean "need_ca"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["envelope_id"], name: "index_envelope_settings_on_envelope_id"
  end

  create_table "envelopes", force: :cascade do |t|
    t.string "long_id", null: false
    t.integer "owner_id"
    t.string "envelope_name"
    t.boolean "has_order", default: true
    t.integer "status", default: 0
    t.datetime "modified_at", null: false
    t.datetime "completed_at"
    t.json "start_from", default: {}, null: false
    t.integer "sign_type", default: 0
    t.integer "group_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["long_id"], name: "index_envelopes_on_long_id", unique: true
    t.index ["owner_id"], name: "index_envelopes_on_owner_id"
  end

  create_table "field_setting_groups", force: :cascade do |t|
    t.string "source_type"
    t.integer "source_id"
    t.string "stage_type"
    t.integer "stage_id"
    t.string "field_group_type"
    t.string "field_group_object_id"
    t.json "options", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["source_type", "source_id"], name: "index_field_setting_groups_on_source_type_and_source_id"
    t.index ["stage_type", "stage_id"], name: "index_field_setting_groups_on_stage_type_and_stage_id"
  end

  create_table "field_settings", force: :cascade do |t|
    t.string "source_type"
    t.integer "source_id"
    t.string "stage_type"
    t.integer "stage_id"
    t.string "field_object_id"
    t.string "field_type"
    t.json "field_value"
    t.float "coord", default: [], array: true
    t.integer "page"
    t.json "options", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "custom_id"
    t.integer "field_setting_group_id"
    t.index ["field_setting_group_id"], name: "index_field_settings_on_field_setting_group_id"
    t.index ["source_id", "source_type", "custom_id"], name: "index_field_settings_on_source_id_and_source_type_and_custom_id", unique: true, where: "((custom_id IS NOT NULL) AND ((custom_id)::text <> ''::text))"
    t.index ["source_type", "source_id"], name: "index_field_settings_on_source_type_and_source_id"
    t.index ["stage_type", "stage_id"], name: "index_field_settings_on_stage_type_and_stage_id"
  end

  create_table "group_decline_reasons", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "decline_reason_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["decline_reason_id"], name: "index_group_decline_reasons_on_decline_reason_id"
    t.index ["group_id"], name: "index_group_decline_reasons_on_group_id"
  end

  create_table "group_invites", force: :cascade do |t|
    t.integer "group_id", null: false
    t.integer "member_id", null: false
    t.integer "status", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.string "unique_name", null: false
    t.integer "status", default: 0
    t.json "icon_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "guest_signatures", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "other_info", default: {}
    t.string "category", default: "signature"
    t.index ["category"], name: "index_guest_signatures_on_category"
    t.index ["other_info"], name: "index_guest_signatures_on_other_info", opclass: :jsonb_path_ops, using: :gin
  end

  create_table "identities", force: :cascade do |t|
    t.string "uid", null: false
    t.string "provider", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid", "provider"], name: "index_identities_on_uid_and_provider"
    t.index ["user_id"], name: "index_identities_on_user_id"
  end

  create_table "images", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "member_roles", force: :cascade do |t|
    t.integer "member_id", null: false
    t.integer "role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "members", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", default: ""
    t.string "phone_code", default: ""
    t.string "phone_number", default: ""
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_registered", default: false
    t.datetime "complaint_at"
    t.datetime "bounced_at"
    t.integer "from_application_id"
    t.integer "monthly_task_usage", default: 0
    t.json "preferences", default: {}
    t.integer "group_id"
    t.string "external_id"
    t.integer "status", default: 0
    t.index ["email"], name: "index_members_on_email", unique: true
    t.index ["reset_password_token"], name: "index_members_on_reset_password_token", unique: true
  end

  create_table "oauth_access_grants", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "scopes", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri"
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "profiles", force: :cascade do |t|
    t.integer "member_id", null: false
    t.string "language", default: "zh-TW"
    t.string "full_name", default: ""
    t.string "first_name", default: ""
    t.string "telephone", default: ""
    t.string "nationality", default: ""
    t.string "address", default: ""
    t.string "organization", default: ""
    t.json "icon_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "email"
    t.index ["member_id"], name: "index_profiles_on_member_id"
  end

  create_table "public_forms", force: :cascade do |t|
    t.string "uuid", null: false
    t.integer "owner_id", null: false
    t.bigint "template_id", null: false
    t.string "form_name"
    t.text "description"
    t.integer "sent_num", default: 0
    t.integer "goal_num"
    t.datetime "end_at"
    t.json "signer_infos"
    t.integer "status", default: 0
    t.boolean "is_deleted", default: false
    t.datetime "publish_at"
    t.integer "group_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_public_forms_on_group_id"
    t.index ["owner_id"], name: "index_public_forms_on_owner_id"
    t.index ["template_id"], name: "index_public_forms_on_template_id"
    t.index ["uuid"], name: "index_public_forms_on_uuid", unique: true
  end

  create_table "review_logs", force: :cascade do |t|
    t.string "source_type", null: false
    t.integer "source_id", null: false
    t.string "stage_type", null: false
    t.integer "stage_id", null: false
    t.integer "sign_event_id", null: false
    t.json "reviewed_fields", default: [], array: true
    t.json "reviewed_attachments", default: [], array: true
    t.string "reviewed_message", default: ""
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sign_event_id"], name: "index_check_logs_on_sign_event_id"
    t.index ["source_type", "source_id"], name: "index_check_logs_on_source_type_and_source_id"
    t.index ["stage_type", "stage_id"], name: "index_check_logs_on_stage_type_and_stage_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.integer "group_id", null: false
    t.json "permission", default: {}
    t.integer "priority", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "service_files", force: :cascade do |t|
    t.string "storable_type", null: false
    t.integer "storable_id", null: false
    t.string "label"
    t.datetime "uploaded_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "deleted_at"
    t.index ["storable_type", "storable_id"], name: "index_service_files_on_storable_type_and_storable_id"
  end

  create_table "share_settings", force: :cascade do |t|
    t.string "shared_type", null: false
    t.integer "shared_id", null: false
    t.string "target_type", null: false
    t.integer "target_id", null: false
    t.json "detail", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shared_type", "shared_id"], name: "index_share_settings_on_shared_type_and_shared_id"
    t.index ["target_type", "target_id"], name: "index_share_settings_on_target_type_and_target_id"
  end

  create_table "sign_events", force: :cascade do |t|
    t.integer "sign_task_id"
    t.integer "owner_id"
    t.string "task_type"
    t.string "task_status"
    t.string "stage_type"
    t.integer "stage_id"
    t.integer "actor_id"
    t.string "stage_status"
    t.string "file_name"
    t.string "event_target"
    t.string "action_name"
    t.integer "action_member_id"
    t.boolean "task_deleted", default: false, null: false
    t.boolean "task_expired", default: false, null: false
    t.string "ip_address"
    t.string "device"
    t.json "user_agent", default: {}
    t.json "other_info", default: {}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "envelope_id"
    t.index ["action_member_id"], name: "index_sign_events_on_action_member_id"
    t.index ["envelope_id"], name: "index_sign_events_on_envelope_id"
    t.index ["sign_task_id", "owner_id"], name: "index_sign_events_on_sign_task_id_and_owner_id"
    t.index ["stage_type", "stage_id", "actor_id"], name: "index_sign_events_on_stage_type_and_stage_id_and_actor_id"
  end

  create_table "sign_logs", force: :cascade do |t|
    t.string "source_type", null: false
    t.integer "source_id", null: false
    t.string "stage_type", null: false
    t.integer "stage_id", null: false
    t.integer "sign_event_id", null: false
    t.json "signed_fields", default: [], array: true
    t.json "signed_attachments", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sign_event_id"], name: "index_sign_logs_on_sign_event_id"
    t.index ["source_type", "source_id"], name: "index_sign_logs_on_source_type_and_source_id"
    t.index ["stage_type", "stage_id"], name: "index_sign_logs_on_stage_type_and_stage_id"
  end

  create_table "sign_stages", force: :cascade do |t|
    t.integer "sign_task_id"
    t.integer "sequence"
    t.string "email", null: false
    t.integer "actor_id", null: false
    t.string "actor_name"
    t.json "pdf_object_info"
    t.integer "status", default: 0
    t.datetime "processing_from"
    t.json "attachment_setting", default: []
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "group_id"
    t.json "custom_message_setting", default: {"processing_viewable"=>false, "completed_viewable"=>false}
    t.string "action", default: "sign"
    t.jsonb "actor_info", default: {}
    t.index ["actor_id"], name: "index_sign_stages_on_actor_id"
    t.index ["sign_task_id"], name: "index_sign_stages_on_sign_task_id"
  end

  create_table "sign_tasks", force: :cascade do |t|
    t.string "long_id", null: false
    t.integer "owner_id"
    t.string "file_name"
    t.boolean "has_order", default: true
    t.integer "status", default: 0
    t.datetime "modified_at", null: false
    t.datetime "completed_at"
    t.json "start_from", default: {}, null: false
    t.integer "sign_type", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "bulk_mission_id"
    t.integer "group_id"
    t.integer "file_status", default: 0
    t.bigint "envelope_id"
    t.json "file_info", default: {}
    t.integer "position", default: 1
    t.integer "public_form_id"
    t.index ["envelope_id"], name: "index_sign_tasks_on_envelope_id"
    t.index ["long_id"], name: "index_sign_tasks_on_long_id"
    t.index ["owner_id"], name: "index_sign_tasks_on_owner_id"
  end

  create_table "signatures", force: :cascade do |t|
    t.integer "member_id", null: false
    t.string "category", null: false
    t.string "file_type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "other_info", default: {}
    t.index ["category"], name: "index_signatures_on_category"
    t.index ["other_info"], name: "index_signatures_on_other_info", opclass: :jsonb_path_ops, using: :gin
  end

  create_table "stage_settings", force: :cascade do |t|
    t.string "stage_type", null: false
    t.integer "stage_id", null: false
    t.boolean "forward_enable", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "decline_enable", default: false
    t.boolean "informable", default: false
    t.json "requisite", default: {}
    t.boolean "viewable_in_completed", default: true
    t.boolean "viewable_in_processing", default: false
    t.string "viewable_in_processing_attachments", default: [], array: true
    t.string "specified_lang"
    t.boolean "reviewed_skip_confirm", default: true
    t.index ["stage_type", "stage_id"], name: "index_stage_settings_on_stage_type_and_stage_id"
  end

  create_table "system_ca_access_rights", force: :cascade do |t|
    t.bigint "system_ca_id", null: false
    t.string "accessor_type", null: false
    t.bigint "accessor_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["accessor_type", "accessor_id"], name: "index_system_ca_access_rights_on_accessor"
    t.index ["system_ca_id"], name: "index_system_ca_access_rights_on_system_ca_id"
  end

  create_table "system_cas", force: :cascade do |t|
    t.string "cluster_id", null: false
    t.string "token", null: false
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "pem", null: false
    t.bigint "group_id", null: false
    t.string "name"
    t.index ["group_id"], name: "index_system_cas_on_group_id"
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.integer "prev_id"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "task_settings", force: :cascade do |t|
    t.integer "sign_task_id", null: false
    t.boolean "forget_remind", default: false
    t.datetime "deadline"
    t.datetime "expire_remind_at"
    t.text "message"
    t.boolean "need_otp_verify", default: false
    t.boolean "inform_enable", default: true
    t.string "receiver_lang", default: "zh-TW"
    t.json "cc_info", default: []
    t.json "reference_setting", default: []
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "need_ca", default: false
    t.text "completed_message"
    t.json "completed_reference_setting", default: []
    t.index ["sign_task_id"], name: "index_task_settings_on_sign_task_id", unique: true
  end

  create_table "template_settings", force: :cascade do |t|
    t.bigint "template_id", null: false
    t.boolean "forget_remind", default: false
    t.datetime "deadline"
    t.datetime "expire_remind_at"
    t.text "message"
    t.text "completed_message"
    t.boolean "need_otp_verify", default: false
    t.boolean "inform_enable", default: true
    t.string "receiver_lang", default: "zh-TW"
    t.json "cc_info", default: []
    t.json "reference_setting", default: []
    t.json "completed_reference_setting", default: []
    t.boolean "need_ca", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["template_id"], name: "index_template_settings_on_template_id"
  end

  create_table "templates", force: :cascade do |t|
    t.string "file_name"
    t.integer "owner_id"
    t.integer "status", default: 0
    t.boolean "has_order", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "group_id"
    t.string "code"
    t.integer "usage", default: 0, null: false
    t.index ["code"], name: "index_templates_on_code"
    t.index ["owner_id"], name: "index_templates_on_owner_id"
  end

  create_table "verify_methods", force: :cascade do |t|
    t.integer "sequence", null: false
    t.string "verify_type", null: false
    t.string "verify_source"
    t.string "uuid"
    t.integer "execute_type", default: 0
    t.integer "trigger_at"
    t.datetime "last_verify_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "occassion", default: "sign"
    t.string "stage_type"
    t.integer "stage_id"
    t.index ["execute_type", "stage_type", "stage_id", "sequence"], name: "verify_step_index"
    t.index ["stage_type", "stage_id", "uuid"], name: "index_verify_methods_on_stage_type_and_stage_id_and_uuid"
    t.index ["stage_type", "stage_id"], name: "index_verify_methods_on_stage_type_and_stage_id"
    t.index ["uuid"], name: "index_verify_methods_on_uuid", unique: true
  end

  create_table "xfdf_documents", force: :cascade do |t|
    t.string "source_type"
    t.integer "source_id"
    t.string "stage_type"
    t.integer "stage_id"
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["source_type", "source_id"], name: "index_xfdf_documents_on_source_type_and_source_id"
    t.index ["stage_type", "stage_id"], name: "index_xfdf_documents_on_stage_type_and_stage_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "group_decline_reasons", "decline_reasons"
  add_foreign_key "group_decline_reasons", "groups"
  add_foreign_key "identities", "members", column: "user_id"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "public_forms", "templates"
  add_foreign_key "system_ca_access_rights", "system_cas"
  add_foreign_key "system_cas", "groups"
  add_foreign_key "taggings", "tags"
end
