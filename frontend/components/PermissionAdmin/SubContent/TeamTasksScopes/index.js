import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { getTagsAdmin as getTagsAdminAction } from "../../../../redux/actions/admin";
import tooltip from "../../../../constants/tooltip";
import Tooltip from "../../../../containers/Tooltip";
import SelectMulti from "../../../../containers/SelectMulti";
import Checkbox from "../../../Checkbox";
import { Wrapper, Item, Label, WrapperSelect, Tags, Tag } from "./styled";

const Sub = ({ isFixed, isEdit, permission, onUpdate }) => {
  const [options, setOptions] = useState([]);
  const [optionsActive, setOptionsActive] = useState([]);
  const { t } = useTranslation(["admin", "common"]);

  const { tagsAdmin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const getTags = useCallback(
    (data) => dispatch(getTagsAdminAction(data)),
    [dispatch],
  );

  const onSelectAll = () => {
    onUpdate({
      key: "view_team_tasks_scopes",
      value: ["*"],
    });
  };

  const onSelectPartial = () => {
    if (isPartialReadOnly) {
      return;
    }

    onUpdate({
      key: "view_team_tasks_scopes",
      value: [],
    });
  };

  const onSelectFromMenu = (operation, itm) => {
    const itms = optionsActive;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    const temp = updatedItms.map((obj) => obj.key);
    onUpdate({
      key: "view_team_tasks_scopes",
      value: temp,
    });
  };

  useEffect(() => {
    if (tagsAdmin) {
      setOptions(tagsAdmin.map((tag) => ({ key: tag, text: tag })));
      return;
    }

    getTags();
  }, [tagsAdmin, getTags]);

  useEffect(() => {
    if (!permission) {
      return;
    }

    setOptionsActive(permission.map((key) => ({ key, text: key })));
  }, [permission]);

  const isReadOnly = !isEdit || isFixed;

  const isPartialReadOnly = (() => {
    if (isReadOnly) {
      return true;
    }
    if (!tagsAdmin) {
      return true;
    }
    return tagsAdmin.length < 1;
  })();

  return (
    <Wrapper>
      <Item>
        <Checkbox
          isChecked={permission.indexOf("*") > -1}
          isReadOnly={isReadOnly}
          onToggle={onSelectAll}
          isRadio
        />
        <Label>{t("common:all")}</Label>
      </Item>

      <Item>
        <Checkbox
          isChecked={permission.indexOf("*") < 0}
          isReadOnly={isPartialReadOnly}
          onToggle={onSelectPartial}
          isRadio
        />
        <Label>{t("group_labels_specified")}</Label>
        &nbsp;
        <Tooltip type={tooltip.specifiedGroupLabels} />
        {permission.indexOf("*") < 0 && (
          <WrapperSelect>
            <SelectMulti
              options={options}
              optionsActive={optionsActive}
              objKey="key"
              objText="text"
              placeholder={t("common:label_group")}
              onUpdate={onSelectFromMenu}
              isReadOnly={isPartialReadOnly}
            />

            <Tags>
              {permission.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          </WrapperSelect>
        )}
      </Item>
    </Wrapper>
  );
};

export default Sub;
