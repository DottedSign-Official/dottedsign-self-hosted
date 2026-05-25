import React from "react";
import { useTranslation } from "next-i18next";
import dataset from "./data";
import Button from "../Button";
import { Wrapper, Item } from "./styled";

const MenuDeveloper = ({ page }) => {
  const { t } = useTranslation("developer");

  return (
    <Wrapper>
      {Object.keys(dataset).map((key, idx) => (
        <Button
          key={idx}
          url={`/developer/${dataset[key].path}`}
          btnStyle={{ width: "100%" }}
        >
          <Item isActive={key === page}>{t(dataset[key].text)}</Item>
        </Button>
      ))}
    </Wrapper>
  );
};

export default MenuDeveloper;
