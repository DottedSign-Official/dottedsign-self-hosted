import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Icon from "../../Icon";
import { Label } from "../../../global/styledAdmin";
import {
  Wrapper,
  Btn,
  WrapperRole,
  Role,
  More,
  WrapperIcon,
  MenuMore,
  MenuItem,
} from "./styled";

const RoleItem = ({
  t,
  role,
  isActive,
  onDeleteRole,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  roleDefault,
}) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const refTimer = useRef(null);
  const roleId = role.role_id;
  const router = useRouter();

  const onFocus = () => {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
  };

  const onBlur = () => {
    refTimer.current = setTimeout(() => {
      setIsCollapse(true);
    });
  };

  const onMoreClick = () => {
    setIsCollapse(false);
  };

  const onToggle = () => {
    setIsCollapse((prev) => !prev);
  };

  const isMore = isActive && role.name !== "admin";

  const link = `/admin/permissions/?focus=${encodeURIComponent(role.name)}`;

  return (
    <WrapperRole>
      <Role isActive={isActive} onClick={() => router.push(link)}>
        {role.name}
      </Role>

      {isMore && (
        <More tabIndex={10} onFocus={onFocus} onBlur={onBlur}>
          <WrapperIcon onClick={onMoreClick}>
            <Icon type="more" />
          </WrapperIcon>

          {!isCollapse && (
            <MenuMore onClick={onToggle}>
              <MenuItem onClick={() => onMoveToTop(roleId)}>
                <p>{t("move_to_top", { ns: "common" })}</p>
              </MenuItem>
              <MenuItem onClick={() => onMoveUp(roleId)}>
                <p>{t("move_up", { ns: "common" })}</p>
              </MenuItem>
              <MenuItem onClick={() => onMoveDown(roleId)}>
                <p>{t("move_down", { ns: "common" })}</p>
              </MenuItem>
              {!Object.keys(roleDefault).includes(role.name) && (
                <MenuItem onClick={() => onDeleteRole(roleId)}>
                  <p>{t("delete", { ns: "common" })}</p>
                </MenuItem>
              )}
            </MenuMore>
          )}
        </More>
      )}
    </WrapperRole>
  );
};

const Menu = ({
  t,
  focus,
  roleList,
  onCreateRole,
  onDeleteRole,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  roleDefault,
}) => {
  if (!focus || !roleList) {
    return null;
  }

  return (
    <Wrapper>
      <Label>{t("label_permissions")}</Label>
      <Btn onClick={onCreateRole}>{t("create_role")}</Btn>

      {roleList.map((role) => (
        <RoleItem
          key={role.role_id}
          t={t}
          role={role}
          isActive={role.name === focus}
          onDeleteRole={onDeleteRole}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMoveToTop={onMoveToTop}
          roleDefault={roleDefault}
        />
      ))}
    </Wrapper>
  );
};

export default Menu;
