- [SignTask Enum](#signtask-enum)
- [SignStage Enum](#signstage-enum)
- [Template Enum](#template-enum)


# SignTask Enum
- Category

  | Enum | Description |
  | ---- | ----------- |
  | waiting_for_me | Task is in member's stage to `sign`, `modify`, `confirm` |
  | waiting_for_others | Task is in other member's stage to `sign`, `modify`, `confirm` |
  | completed | Task is `completed`. |
  | canceled | Task is `declined`. |
  | draft | Task is still `draft`. |
- Deadline

  | Enum | Description |
  | ---- | ----------- |
  | expire_soon | Task is expired in 10 days. |
  | expired | Task is expired. |
- Status

  | Enum | Description |
  | ---- | ----------- |
  | draft | Task is draft. |
  | wiating | Task is processing, waiting for members to sign. |
  | completed | Task is completed. |
  | deleted | Task is delted by owner. |
  | declined | Task is declined by one of signers. |

# Template Enum
- Category

  | Enum | Description |
  | ---- | ----------- |
  | own_by_me | Template is created by me. |
  | share_with_me | Template is shared by other group member. |

# SignStage Enum
- Status

  | Enum | Description |
  | ---- | ----------- |
  | initial | Stage not start yet. |
  | processing | Stage is processing. |
  | done | Stage is done. |
  | declined | Stage is declined. |
  | canceled | Previous stage is declined. |

# Group Enum
- Status

  | Enum | Description |
  | ---- | ----------- |
  | active | Group is active now. |
  | suspend | Group is suspend now and can be reactive. When group is suspend, group members current group id will be nil (all related objects will not relate to group); after reactive, group members will related to group again. |
  | dead | Group is dead now and **can not be reactive**. When group is dead, group members will not related to group forever. |

# GroupInvite Enum
- Status

  | Enum | Description |
  | ---- | ----------- |
  | waiting | Invite still waiting for accept. |
  | accepted | Invite already accepted. |
  | removed | Invite revoke from accepted status. |
  | canceled | Invite revoke from waiting status. |
  | disable | Other group invite of same member being accepted. |
