import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import data from "./data";
import WindowWidth from "../../containers/WindowWidth";
import AvatarCollapse from "../../containers/AvatarCollapse";
import Button from "../Button";
import Icon from "../Icon";
import { Wrapper, WrapperBtn, Item, WrapperIcon } from "./styled";
import { HEADER_BREAKPOINT_LG } from "../Header/styled";

const HeaderAux = ({ windowWidth }) => {
  const isVerified = useSelector((state) => state.auth.isVerified);
  const router = useRouter();
  const checkActivity = (key) => router.pathname.indexOf(key) !== -1;
  return (
    <Wrapper>
      {windowWidth > HEADER_BREAKPOINT_LG && (
        <>
          {data.map((item, idx) => (
            <WrapperBtn key={idx}>
              <Button type="headerBtn" url={isVerified ? item.url : null}>
                <Item>
                  <WrapperIcon>
                    <Icon
                      type={
                        checkActivity(item.key) ? item.iconActive : item.icon
                      }
                    />
                  </WrapperIcon>
                </Item>
              </Button>
            </WrapperBtn>
          ))}
          <WrapperBtn>
            <AvatarCollapse isAlignRight />
          </WrapperBtn>
        </>
      )}
    </Wrapper>
  );
};

export default WindowWidth(HeaderAux);
