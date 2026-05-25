import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  getOrganization,
  setFocusMembers as setFocusMembersAction,
} from "../../redux/actions/admin";
import Loader from "../../components/Loaders/Label";
import SelectMulti from "../SelectMulti";
import { Block, Label, WrapperSelect } from "../../global/styledAdmin";

const SelectUsersAdmin = () => {
  const { t } = useTranslation("admin");

  const refTimer = useRef(null);
  const [isInit, setIsInit] = useState(true);
  const org = useSelector((state) => state.admin.organization);
  const selectedMember = useSelector((state) => state.admin.focusMembers);
  const dispatch = useDispatch();
  const setFocusMembers = (data) => dispatch(setFocusMembersAction(data));

  const optionsActive =
    org &&
    org.group_members.filter((usr) => selectedMember.indexOf(usr.email) !== -1);

  const onUpdate = (operation, itm) => {
    const itms = optionsActive;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    const temp = updatedItms.map((obj) => obj.email);
    setFocusMembers(temp);
  };

  useEffect(() => {
    dispatch(getOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (isInit && org) {
      clearTimeout(refTimer.current);
      setIsInit(false);
    }
  }, [org, isInit]);

  useEffect(() => {
    refTimer.current = setTimeout(() => {
      setIsInit(false);
    }, 8000);

    return () => clearTimeout(refTimer.current);
  }, []);

  const isPlaceholder = isInit && !org;

  const content = () => {
    if (isPlaceholder) {
      return <Loader />;
    }

    return (
      <SelectMulti
        options={
          org &&
          org.group_members.filter(
            ({ name, status }) => name && status === "accepted",
          )
        }
        optionsActive={optionsActive}
        objKey="name"
        placeholder={t("placeholder_select_users")}
        onUpdate={onUpdate}
        isLightTheme
      />
    );
  };

  return (
    <Block width="50%" zIndex="2">
      {isPlaceholder ? <Loader /> : <Label>{t("label_select_users")}</Label>}
      <WrapperSelect>{content()}</WrapperSelect>
    </Block>
  );
};

export default SelectUsersAdmin;
