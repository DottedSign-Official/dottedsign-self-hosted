import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import dataset from "./data";
import { Wrapper, Sketch, Text } from "./styled";

const Blank = ({ type }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const data = dataset[type];

  const onNavigate = () => {
    if (!data.link) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    router.push(data.link);
  };

  return (
    <Wrapper isMini={data.isMini}>
      <Sketch src={data.sketch} alt="sketch" />
      <Text
        onClick={onNavigate}
        dangerouslySetInnerHTML={{ __html: t(data.text) }}
      />
    </Wrapper>
  );
};

export default Blank;
