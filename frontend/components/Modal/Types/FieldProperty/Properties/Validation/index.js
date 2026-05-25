import React, { useRef } from "react";
import tooltipType from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import { VALIDATION_TYPE } from "../../../../../../constants/constants";
import Input from "../../../../../../containers/Input";
import Select from "../../../../../../containers/Select";
import { Block, Label, Item, Break } from "../../styled";

const itemValidation = [
  {
    key: VALIDATION_TYPE.NONE,
    text: "none",
  },
  {
    key: VALIDATION_TYPE.EMAIL,
    text: "email",
  },
  {
    key: VALIDATION_TYPE.NUMBERS,
    text: "numbers",
  },
  {
    key: VALIDATION_TYPE.LETTERS,
    text: "letters",
  },
  {
    key: VALIDATION_TYPE.CREDIT_CARD,
    text: "credit_card",
  },
  {
    key: VALIDATION_TYPE.REGEX,
    text: "regex",
  },
];

const Validation = ({ t, onChange, validation, validation_regex }) => {
  const refInput = useRef();

  const onValidationChanged = (itm) => {
    onChange({
      validation: itm.key,
      validation_regex: null,
    });
  };

  const onRegexSubmit = (value) => {
    onChange({
      validation_regex: value,
    });
  };

  const activeValidation =
    itemValidation.find((itm) => itm.key === validation) || itemValidation[0];

  const isRegex = validation === VALIDATION_TYPE.REGEX;

  return (
    <>
      <Block>
        <Label>
          {t("validation")}

          <span>
            <Tooltip type={tooltipType.regex} position={"top"} />
          </span>
        </Label>
        <Item>
          <Select
            activeItem={activeValidation}
            items={itemValidation}
            indexKey="key"
            indexText="text"
            onSelectEvent={onValidationChanged}
          />
        </Item>

        {isRegex && (
          <>
            <Break />
            <Item>
              <Input
                refInput={refInput}
                placeholder={"e.g. ^[a-zA-Z0-9]*$"}
                value={validation_regex || ""}
                onSubmit={onRegexSubmit}
              />
            </Item>
          </>
        )}
      </Block>
    </>
  );
};

export default Validation;
