import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { onLogout } from "../../../helpers/auth";
import Panel from "../Panel";
import Button from "../../Button";
import Avatar from "../../../containers/AvatarMy";
import Icon from "../../Icon";
import {
  Wrapper,
  Back,
  Content,
  Block,
  WrapperAvatar,
  Info,
  WrapperBtn,
} from "./styled";

const MobilePanel = ({ isVerified }) => {
  const { t } = useTranslation("common");
  const timerRef = useRef();
  const [isCollapse, setIsCollapse] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const onExpand = () => {
    setIsVisible(true);
    setIsCollapse(false);
  };

  const onCollapse = () => {
    setIsVisible(false);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsCollapse(true);
    }, 400);
  };

  useEffect(() => {
    if (isCollapse) {
      clearAllBodyScrollLocks();
    } else {
      disableBodyScroll();
    }
  }, [isCollapse]);

  return (
    <Wrapper>
      <Button type="icon" handleEvent={onExpand}>
        <Icon type="menu" />
      </Button>
      {!isCollapse && (
        <>
          <Back onClick={onCollapse} />
          <Content isVisible={isVisible}>
            <Block>
              <WrapperAvatar>
                <Avatar width="40px" height="40px" />
                <Info>
                  <b>{user.name}</b>
                  <p>{user.email}</p>
                </Info>
              </WrapperAvatar>
            </Block>
            <Block>
              <Panel isVerified={isVerified} isMobile />
            </Block>
            <Block>
              <WrapperBtn>
                <Button type="headerBtn" handleEvent={onLogout}>
                  <p>{t("logout")}</p>
                </Button>
              </WrapperBtn>
            </Block>
          </Content>
        </>
      )}
    </Wrapper>
  );
};

export default MobilePanel;
