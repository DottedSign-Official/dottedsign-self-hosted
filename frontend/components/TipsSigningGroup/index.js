import React from "react";
import { useTranslation } from "next-i18next";
import tips from "../../constants/tips";
import { useSigningGroups } from "../../helpers/customHooks";
import Loader from "../Loaders/Tips";
import Tips from "../Tips";
import Icon from "../Icon";
import { Wrapper, WrapperIcon, Text, Desc } from "./styled";

const TipsSigningGroup = ({ isIniLoading }) => {
  const { t } = useTranslation("common");
  const { isCreatable, amount, limit } = useSigningGroups();

  if (isIniLoading) {
    return <Loader />;
  }

  if (typeof limit !== "number" || typeof amount !== "number") {
    return <Loader />;
  }

  if (isCreatable) {
    return <Tips type={tips.settingsSigningGroup} />;
  }

  const text =
    limit === amount
      ? "tips_template_limit_reached"
      : "tips_template_limit_exceeded";

  return (
    <Wrapper>
      <WrapperIcon>
        <Icon type="exclamation" size="24px" />
      </WrapperIcon>

      <Text>
        <Desc
          dangerouslySetInnerHTML={{
            __html: `${t(text)} <span>${amount}</span> / ${limit}`,
          }}
        />
      </Text>
    </Wrapper>
  );
};

export default TipsSigningGroup;
