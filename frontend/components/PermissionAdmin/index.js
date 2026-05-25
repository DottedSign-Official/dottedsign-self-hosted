import React from "react";
import { useTranslation } from "next-i18next";
import Menu from "./Menu";
import BtnContent from "./BtnContent";
import Main from "./Main";
import {
  Wrapper,
  WrapperMenu,
  WrapperContent,
  Title,
  Label,
  Btns,
} from "./styled";

const PermissionAdmin = ({
  focus,
  isLoading,
  isEdit,
  hiddenKeyList,
  roleList,
  permissions,
  onEdit,
  onUpdate,
  onInterLock,
  onConfirm,
  onCancel,
  onCreateRole,
  onDeleteRole,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  data,
  roleDefault,
  roleCustom,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  const contentMain = () => {
    if (!permissions) {
      return (
        <>
          <Title>
            <Label>{t("label_permissions")}</Label>
          </Title>
          N/A
        </>
      );
    }

    return (
      <>
        <Title>
          <Label>{t(focus)}</Label>

          {focus !== "admin" && (
            <Btns>
              <BtnContent
                isLoading={isLoading}
                isEdit={isEdit}
                onEdit={onEdit}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            </Btns>
          )}
        </Title>

        <Main
          t={t}
          focus={focus}
          isEdit={isEdit}
          hiddenKeyList={hiddenKeyList}
          permissions={permissions}
          onUpdate={onUpdate}
          onInterLock={onInterLock}
          data={data}
          roleDefault={roleDefault}
          roleCustom={roleCustom}
        />
      </>
    );
  };

  return (
    <Wrapper>
      <WrapperMenu>
        <Menu
          t={t}
          focus={focus}
          roleList={roleList}
          onCreateRole={onCreateRole}
          onDeleteRole={onDeleteRole}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMoveToTop={onMoveToTop}
          roleDefault={roleDefault}
        />
      </WrapperMenu>

      <WrapperContent>{contentMain()}</WrapperContent>
    </Wrapper>
  );
};

export default PermissionAdmin;
