export const getFieldObjectActions = (stage, fieldObjectId) => {
  const rules = stage.field_object_rules || [];
  const actions = rules.reduce((acc, rule) => {
    acc[rule.trigger_object_id] = rule.field_object_actions;
    return acc;
  }, {});
  return actions[fieldObjectId] || [];
};
