import React from "react";
import { useTranslation } from "next-i18next";
import { onLogout } from "../../helpers/auth";
import AvatarMy from "../../containers/AvatarMy";
import Lang from "./Lang";
import {
  Wrapper,
  WrapperAvatar,
  Menu,
  Item,
  Sub,
  Name,
  Email,
  ItemBtn,
} from "./styled";

const AvatarCollapse = ({
  isCollapse,
  isAlignRight,
  user,
  adminItem,
  devItem,
  enterpriseItem,
  onBlurEvent,
  onToggle,
}) => {
  const { t } = useTranslation("common");

  return (
    <Wrapper tabIndex="9999" onBlur={onBlurEvent}>
      <WrapperAvatar onClick={onToggle}>
        <AvatarMy />
      </WrapperAvatar>

      {!isCollapse && (
        <Menu isAlignRight={isAlignRight}>
          <Item>
            <Sub>
              <Name>{user.name}</Name>
              <Email>{user.email}</Email>
            </Sub>
          </Item>

          {adminItem && (
            <Item>
              <ItemBtn onClick={adminItem.event}>{t(adminItem.text)}</ItemBtn>
            </Item>
          )}

          {devItem && (
            <Item>
              <ItemBtn onClick={devItem.event}>{t(devItem.text)}</ItemBtn>
            </Item>
          )}

          {enterpriseItem && (
            <Item>
              <ItemBtn onClick={enterpriseItem.event}>
                {t(enterpriseItem.text)}
              </ItemBtn>
            </Item>
          )}

          <Item>
            <Lang />
          </Item>

          <Item>
            <ItemBtn onClick={onLogout} role="button">
              {t("logout")}
            </ItemBtn>
          </Item>
        </Menu>
      )}
    </Wrapper>
  );
};

export default AvatarCollapse;
