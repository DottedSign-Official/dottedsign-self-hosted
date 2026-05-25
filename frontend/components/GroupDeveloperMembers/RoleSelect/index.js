import Select from "../../../containers/Select";
import { useTranslation } from "react-i18next";

const RoleSelect = ({ roleList, onSelectEvent, activeRole }) => {
  const { t } = useTranslation("admin");

  if (!roleList) {
    return null;
  }

  const roleTranslator = (text) => {
    const systemRoles = ["admin", "manager", "member"];
    return systemRoles.includes(text) ? t(text) : text;
  };

  const items = roleList.map(({ name }) => ({
    role: name,
    value: roleTranslator(name),
  }));

  return (
    <Select
      activeItem={items.find(({ role }) => role === activeRole)}
      items={items}
      indexKey="role"
      indexText="value"
      onSelectEvent={({ role }) => onSelectEvent(role)}
    />
  );
};

export default RoleSelect;
