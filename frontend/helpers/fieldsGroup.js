/* NOTE:
type COORD = [
  l: number;
  b: number;
  r: number;
  t: number;
];

type ActionInfo = { show: boolean };

type groups = {
  [field_group_object_id: string]: {
    order: number;
    page: number;
    coord: COORD;
    isRequired: boolean;
    isEditable: boolean;
    action_info: ActionInfo;
  }
}
*/
export const getFieldsGroups = ({ task, isStageEditable }) => {
  const { blocks, fieldGroups } = task;

  const groups =
    fieldGroups?.reduce((acc, group) => {
      return {
        ...acc,
        [group.field_group_object_id]: {
          groupId: group.field_group_object_id,
          order: task.order,
          coord: null,
          isRequired: group.options?.force,
          action_info: group.action_info,
          ...(group.taskId ? { taskId: group.taskId } : {}),
        },
      };
    }, {}) || {};

  blocks.map((block) => {
    let optionsCombined = block.options;

    const isBlockEditable = !optionsCombined.read_only;
    const isFieldEditable = isStageEditable && isBlockEditable;

    // NOTE: group related
    (() => {
      const groupId = block.field_group_object_id;
      const coord = block.coord;

      if (!groupId) {
        return;
      }
      if (!groups[groupId]) {
        return;
      }

      const attrs = {
        groupId: groups[groupId].groupId,
        order: groups[groupId].order,
        page: block.page,
        isRequired: groups[groupId].isRequired,
        isEditable: isFieldEditable,
        action_info: groups[groupId].action_info,
        ...(groups[groupId].taskId ? { taskId: groups[groupId].taskId } : {}),
      };

      let coordGroup = groups[groupId].coord;

      // NOTE: no record
      if (!coordGroup) {
        groups[groupId] = {
          ...attrs,
          coord,
        };
        return;
      }

      // NOTE: existed
      coordGroup = [
        coord[0] < coordGroup[0] ? coord[0] : coordGroup[0],
        coord[1] < coordGroup[1] ? coord[1] : coordGroup[1],
        coord[2] > coordGroup[2] ? coord[2] : coordGroup[2],
        coord[3] > coordGroup[3] ? coord[3] : coordGroup[3],
      ];

      groups[groupId] = {
        ...attrs,
        coord: coordGroup,
      };
    })();
  });

  return groups;
};
