import React from "react";
import { useTranslation } from "next-i18next";
import Chkbox from "../Checkbox";
import { Wrapper, Item } from "./styled";

const MenuBulk = ({ isBulk, onSelect, bulkSendIsAccessible }) => {
  const { t } = useTranslation("create");
  return (
    <Wrapper>
      <Item>
        <Chkbox isRadio isChecked={!isBulk} onToggle={() => onSelect(false)} />
        <p>{t("single_send")}</p>
      </Item>
      {bulkSendIsAccessible && (
        <Item>
          <Chkbox isRadio isChecked={isBulk} onToggle={() => onSelect(true)} />
          <p>{t("bulk_send")}</p>
        </Item>
      )}
    </Wrapper>
  );
};

export default MenuBulk;
