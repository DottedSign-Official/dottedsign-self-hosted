export const FIELD_TYPE = {
  CONTENT_BLOCK: "CONTENT_BLOCK",
  CONTENT_BLOCK_SUB: "CONTENT_BLOCK_SUB",
  INPUT: "INPUT",
};

export const dataParser = ({
  full_name,
  first_name,
  email,
  telephone,
  address,
  organization,
  nationality,
}) => ({
  title: "label_profile",
  type: FIELD_TYPE.CONTENT_BLOCK,
  blocks: [
    {
      title: "label_profile_basic",
      type: FIELD_TYPE.CONTENT_BLOCK_SUB,
      blocks: [
        {
          callback: (data) => ({ full_name: data }),
          title: "settings_profile_full_name",
          type: FIELD_TYPE.INPUT,
          value: full_name || "",
          placeholder: "setting_profile_placeholder_full_name",
        },
        {
          callback: (data) => ({ first_name: data }),
          title: "settings_profile_first_name",
          type: FIELD_TYPE.INPUT,
          value: first_name || "",
          placeholder: "setting_profile_placeholder_first_name",
        },
      ],
    },
    {
      title: "label_profile_contact",
      type: FIELD_TYPE.CONTENT_BLOCK_SUB,
      blocks: [
        {
          callback: (data) => ({ email: data }),
          title: "settings_profile_email",
          type: FIELD_TYPE.INPUT,
          value: email || "",
          placeholder: "setting_profile_placeholder_email",
        },
        {
          callback: (data) => ({ telephone: data }),
          title: "settings_profile_telephone",
          type: FIELD_TYPE.INPUT,
          value: telephone || "",
          placeholder: "setting_profile_placeholder_telephone",
        },
        {
          callback: (data) => ({ address: data }),
          title: "settings_profile_address",
          type: FIELD_TYPE.INPUT,
          value: address || "",
          placeholder: "setting_profile_placeholder_address",
        },
      ],
    },
    {
      title: "label_profile_others",
      type: FIELD_TYPE.CONTENT_BLOCK_SUB,
      blocks: [
        {
          callback: (data) => ({ organization: data }),
          title: "settings_profile_organization",
          type: FIELD_TYPE.INPUT,
          value: organization || "",
          placeholder: "setting_profile_placeholder_organization",
        },
        {
          callback: (data) => ({ nationality: data }),
          title: "settings_profile_nationality",
          type: FIELD_TYPE.INPUT,
          value: nationality || "",
          placeholder: "setting_profile_placeholder_nationality",
        },
      ],
    },
  ],
});
