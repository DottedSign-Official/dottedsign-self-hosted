import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Button from "../../Button";
import Icon from "../../Icon";
import data from "../data";
import { Wrapper, WrapperBtn, Item, WrapperIcon, Text } from "./styled";

const Panel = ({ isVerified, isMobile }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const checkActivity = (key) => router.pathname.indexOf(key) !== -1;

  return (
    <Wrapper>
      {data
        .filter((item) =>
          isMobile ? item : item.key !== "/settings" && item.key !== "/search",
        )
        .map((item, idx) => (
          <WrapperBtn key={idx}>
            <Button type="headerBtn" url={isVerified ? item.url : null}>
              <Item>
                {isMobile && (
                  <WrapperIcon>
                    <Icon
                      type={
                        checkActivity(item.key) ? item.iconActive : item.icon
                      }
                    />
                  </WrapperIcon>
                )}
                <Text isActive={checkActivity(item.key)}>{t(item.text)}</Text>
              </Item>
            </Button>
          </WrapperBtn>
        ))}
    </Wrapper>
  );
};

export default Panel;
