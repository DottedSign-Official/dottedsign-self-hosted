import TeamTasksScopes from "./TeamTasksScopes";

const SubContent = ({
  isFixed,
  isEdit,
  role,
  keyMain,
  sections,
  permissions,
  onUpdate,
}) => {
  if (!keyMain || !sections || !permissions || !onUpdate) {
    return null;
  }
  if (!permissions[keyMain]) {
    return null;
  }

  return sections.map((section) => {
    const isVisible = section.isShow.indexOf(role) > -1;

    if (!isVisible) {
      return null;
    }

    if (section.key === "view_team_tasks_scopes") {
      return (
        <TeamTasksScopes
          key={section.key}
          isFixed={isFixed}
          isEdit={isEdit}
          permission={permissions[section.key]}
          onUpdate={onUpdate}
        />
      );
    }

    return null;
  });
};

export default SubContent;
