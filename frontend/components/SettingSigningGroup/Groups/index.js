import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../Icon";
import More from "./More";
import {
  Placeholder,
  Wrapper,
  Group,
  Name,
  Share,
  WrapperIcon,
  WrapperMore,
} from "./styled";

const ShareIcon = ({ groupInfo }) => {
  if (!groupInfo) {
    return null;
  }

  if (groupInfo.share_by_others) {
    return (
      <WrapperIcon isShared>
        <Icon type="changeSignerWhite" size="18px" />
      </WrapperIcon>
    );
  }

  if (groupInfo.share_by_me) {
    return (
      <WrapperIcon>
        <Icon type="changeSignerWhite" size="18px" />
      </WrapperIcon>
    );
  }

  return null;
};

const Groups = ({ groups }) => {
  const { t } = useTranslation("common");

  if (!groups) {
    return null;
  }

  if (groups.length < 1) {
    return <Placeholder>{t("signing_group_not_found")}</Placeholder>;
  }

  return (
    <Wrapper>
      {groups.map((group) => (
        <Group key={group.combination_id}>
          <Name>{group.name}</Name>

          <Share>
            <ShareIcon groupInfo={group.share_info} />
          </Share>

          <WrapperMore>
            <More group={group} />
          </WrapperMore>
        </Group>
      ))}
    </Wrapper>
  );
};

export default Groups;
