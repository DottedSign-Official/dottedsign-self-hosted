import React, { useRef } from "react";
import tooltipType, { POSITION } from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import Input from "../../../../../../containers/Input";
import Textarea from "../../../../../Textarea";
import { Label, Item } from "../../styled";

const Placeholder = ({ t, myOption, setMyOption, isReadOnly }) => {
  const refInput = useRef();

  const onSubmit = (value) => {
    const trimmedVal = value?.trim() || null;

    setMyOption({
      ...myOption,
      placeholder: trimmedVal,
    });
  };

  const content = (() => {
    if (myOption?.is_multi_line) {
      return (
        <Textarea
          value={myOption.placeholder || ""}
          onSubmit={onSubmit}
          placeholder={t("placeholder")}
          isReadOnly={isReadOnly}
          isHideCounter
        />
      );
    }

    return (
      <Input
        refInput={refInput}
        placeholder={t("placeholder")}
        value={myOption.placeholder || ""}
        onSubmit={onSubmit}
        isReadOnly={isReadOnly}
      />
    );
  })();

  return (
    <>
      <Label>
        {t("placeholder")}
        <span>
          <Tooltip type={tooltipType.placeholder} position={POSITION.top} />
        </span>
      </Label>
      <Item>{content}</Item>
    </>
  );
};

export default Placeholder;
