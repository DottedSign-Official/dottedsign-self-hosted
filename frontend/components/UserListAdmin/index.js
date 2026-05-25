import React from "react";
import { useTranslation } from "next-i18next";
import LoaderLabel from "../Loaders/Label";
import LoaderBtn from "../Loaders/ButtonSettings";
import Loader from "../Loaders/AdminUserList";
import Error from "../ErrorAdmin";
import Icon from "../Icon";
import Tooltip from "../TooltipExtend";
import Select from "../../containers/Select";
import { cols } from "./data";
import { USER_STATUS } from "../../constants/constants";
import { Block, Label, BlockContent } from "../../global/styledAdmin";
import {
  BtnPositive,
  WrapperList,
  ListTitle,
  ListItem,
  Col,
  Text,
  WrapperIcon,
} from "./styled";

const UserList = ({
  isPlaceholder,
  isBtnHide,
  isExpired,
  orderKey,
  isAsc,
  usersAdmin,
  onSetRole,
  onDelMember,
  onOrderChange,
  onDirectionChange,
  roles,
}) => {
  const { t } = useTranslation("admin");
  const roleTranslator = (text) => {
    const systemRoles = ["admin", "manager", "member"];
    return systemRoles.includes(text) ? t(text) : text;
  };

  const blockBtn = () => {
    if (isPlaceholder) {
      return <LoaderBtn />;
    }

    if (isBtnHide) {
      return null;
    }
  };

  const blockContent = () => {
    if (isPlaceholder) {
      return <Loader />;
    }

    if (isExpired) {
      return <Error type="expired" />;
    }

    return (
      <WrapperList>
        <ListTitle>
          {cols.map((itm, idx) => (
            <Col
              key={idx}
              len={itm.len}
              onClick={
                itm.key === orderKey
                  ? onDirectionChange
                  : () => onOrderChange(itm.key)
              }
              isTitle
            >
              {t(itm.key)}
              {orderKey === itm.key && (
                <WrapperIcon isAsc={isAsc}>
                  <Icon type="chevDown" size="18px" />
                </WrapperIcon>
              )}
            </Col>
          ))}
        </ListTitle>

        {usersAdmin.map((user, idx) => {
          const activeItem = {
            role: user.roles[0],
            value: roleTranslator(user.roles[0]),
            email: user.email,
          };
          const items = roles.map(({ name }) => ({
            role: name,
            value: roleTranslator(name),
            email: user.email,
          }));
          const isSelectable =
            !isBtnHide &&
            roles.length > 0 &&
            user.status === USER_STATUS.accepted;
          const isDeleTable =
            !isBtnHide &&
            user.roles[0] !== "admin" &&
            (user.status === USER_STATUS.accepted ||
              user.status === USER_STATUS.waiting);

          return (
            Object.keys(USER_STATUS).indexOf(user.status) !== -1 && (
              <ListItem key={idx}>
                <Col len={"15%"}>
                  <Tooltip text={user.name} />
                </Col>
                <Col len={"30%"}>
                  <Tooltip text={user.email} />
                </Col>
                <Col len={"25%"}>
                  {isSelectable ? (
                    <Select
                      activeItem={activeItem}
                      items={items}
                      indexKey="role"
                      indexText="value"
                      onSelectEvent={onSetRole}
                    />
                  ) : (
                    <Text>{roleTranslator(user.roles[0])}</Text>
                  )}
                </Col>
                <Col len={"15%"}>
                  <Text isBold={user.status === USER_STATUS.accepted}>
                    {t(user.status)}
                  </Text>
                </Col>
                {isDeleTable && (
                  <Col len={"10%"}>
                    <BtnPositive onClick={() => onDelMember(user.email)}>
                      {t("remove")}
                    </BtnPositive>
                  </Col>
                )}
              </ListItem>
            )
          );
        })}
      </WrapperList>
    );
  };

  return (
    <Block width="100%">
      {isPlaceholder ? <LoaderLabel /> : <Label>{t("label_user_list")}</Label>}
      <BlockContent>
        {blockBtn()}
        {blockContent()}
      </BlockContent>
    </Block>
  );
};

export default UserList;
