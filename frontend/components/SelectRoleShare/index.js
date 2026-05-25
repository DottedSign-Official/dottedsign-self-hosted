import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { rolesSystem } from "../../constants/constants";
import SelectMulti from "../../containers/SelectMulti";
import Checkbox from "../Checkbox";
import { Wrapper, Item, Label, WrapperSub } from "./styled";
/* NOTE:
type fields = { [role]: boolean };
type fieldsCustom = Array<string>;
type onUpdate = (date: fields) => void;
*/
const SelectRoleShare = ({ fields, setFields }) => {
  const { t } = useTranslation("common");

  const [options, setOptions] = useState([]);
  const [optionsActive, setOptionsActive] = useState([]);

  const fieldsCustom =
    (fields &&
      Object.keys(fields).filter((role) => rolesSystem.indexOf(role) < 0)) ||
    [];
  const isCustom = fieldsCustom.length > 0;
  const isSharingCustom =
    fieldsCustom.filter((role) => fields[role] === true).length > 0;

  const onToggleCustom = () => {
    if (!isCustom) {
      return null;
    }

    if (isSharingCustom) {
      const objUpdate = fieldsCustom.reduce((acc, role) => {
        return { ...acc, [role]: false };
      }, {});

      setFields({
        ...fields,
        ...objUpdate,
      });
      return;
    }

    setFields({
      ...fields,
      [fieldsCustom[0]]: true,
    });
  };

  const onUpdate = (operation, itm) => {
    const itms = optionsActive;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    setFields({
      ...fields,
      [itm.key]: operation === "add" ? true : false,
    });
    setOptionsActive(updatedItms);
  };

  useEffect(() => {
    if (!fields) {
      return;
    }

    setOptions(
      Object.keys(fields)
        .filter((key) => !rolesSystem.includes(key))
        .map((key) => ({ key, text: key })),
    );
  }, [fields]);

  useEffect(() => {
    if (!fields) {
      return;
    }
    setOptionsActive(options.filter((option) => fields[option.key]));
  }, [options, fields]);

  if (fieldsCustom.length < 0) {
    return null;
  }

  return (
    <Wrapper>
      <Item>
        <Checkbox
          isChecked={isSharingCustom}
          onToggle={onToggleCustom}
          isReadOnly={!isCustom}
        />
        <Label>{t("custom_role")}</Label>
      </Item>

      {isSharingCustom && (
        <WrapperSub>
          <SelectMulti
            options={options}
            optionsActive={optionsActive}
            objKey="key"
            objText="text"
            placeholder={t("custom_role")}
            onUpdate={onUpdate}
          />
        </WrapperSub>
      )}
    </Wrapper>
  );
};

export default SelectRoleShare;
