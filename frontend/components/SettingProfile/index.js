import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import LoaderBtn from "../Loaders/ButtonSettings";
import Btn from "../Button";
import { DividerBtn } from "../../global/styled";
import { ButtonWrapper } from "./styled";
import { dataParser, FIELD_TYPE } from "./data";
import ElementDictionary from "./ElementDictionary";
import LoadingElementDictionary from "./LoadingElementDictionary";

const SettingProfile = ({ isLoading, initialValue, onSubmit }) => {
  const focusRefs = useRef([]);
  const { t } = useTranslation("settings");
  const [isEdit, setIsEdit] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    setProfile({ ...initialValue });
  }, [initialValue]);

  const onCancel = () => {
    setIsEdit(false);
    setProfile(initialValue);
  };

  const onSave = () => {
    setIsEdit(false);
    onSubmit(profile);
  };

  const Buttons = (() => {
    if (isLoading) {
      return <LoaderBtn />;
    }

    if (isEdit) {
      return (
        <ButtonWrapper>
          <Btn type="cancel" handleEvent={onCancel}>
            {t("cancel")}
          </Btn>
          <DividerBtn />
          <Btn type="primaryFlex" handleEvent={onSave}>
            {t("save")}
          </Btn>
        </ButtonWrapper>
      );
    } else {
      return (
        <Btn type="settingEdit" handleEvent={() => setIsEdit(true)}>
          {t("edit")}
        </Btn>
      );
    }
  })();

  let focusIndex = 0;
  const getFocusNextByIndex = (index) => {
    const nextIndex = index + 1;
    return () => {
      if (nextIndex < focusRefs.current.length) {
        focusRefs.current[nextIndex].focus();
      }
    };
  };
  const getRefSetterByIndex = (index) => {
    return (ref) => {
      focusRefs.current[index] = ref;
    };
  };

  const renderNestedBlocks = (data) => {
    const { type, title, blocks, placeholder, value, callback } = data;
    const hasChildren = blocks && blocks.length;

    const ELement = isLoading
      ? LoadingElementDictionary[type]
      : ElementDictionary[type];

    const props = {
      title: t(title),
    };

    if (!isLoading && type === FIELD_TYPE.INPUT) {
      props.callback = (data) => {
        setProfile({
          ...profile,
          ...callback(data),
        });
      };
      props.value = value;
      props.placeholder = t(placeholder);
      props.isEdit = isEdit;
      props.onEnter = getFocusNextByIndex(focusIndex);
      props.ref = getRefSetterByIndex(focusIndex);

      focusIndex++;
    }

    return (
      <ELement {...props}>
        {hasChildren &&
          blocks.map((block, idx) => (
            <React.Fragment key={idx}>
              {renderNestedBlocks(block)}
            </React.Fragment>
          ))}
      </ELement>
    );
  };

  return (
    <>
      {renderNestedBlocks(dataParser(profile))}
      {Buttons}
    </>
  );
};

export default SettingProfile;
