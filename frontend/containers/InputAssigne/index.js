import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { getContacts } from "../../redux/actions/member";
import InputAssigne from "../../components/InputAssigne";

const InputAssigneContainer = ({
  tag,
  isMe,
  item,
  onModify,
  onParentFocus,
  position,
  isReadOnly,
}) => {
  const { t } = useTranslation("create");

  const refInput = useRef(null);
  const [contactListCopy, setContactListCopy] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [isCollapse, setIsCollapse] = useState(true);
  const [typingItem, setTypingItem] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.create.isLoadingContact);
  const contacts = useSelector((state) => state.member.contacts);
  const dispatch = useDispatch();

  useEffect(() => {
    setTypingItem(item);
  }, [item]);

  useEffect(() => {
    if (!contacts) {
      dispatch(getContacts());
    }
  }, [contacts, dispatch]);

  useEffect(() => {
    if (user && contacts) {
      let newContactList = [];
      let myContacts = [];

      const stageSettingMe = {
        forward_enable: true,
        decline_enable: false,
        viewable_in_processing: true,
        viewable_in_completed: true,
      };

      const me = {
        isMe: true,
        label: t("add_me"),
        name: user.name,
        email: user.email,
        stage_setting: item.action === "review" ? null : stageSettingMe,
        action: item.action,
      };

      contacts.map((cont) => {
        myContacts.push({
          label: tag === "name" ? cont.name : cont.email,
          name: cont.name,
          email: cont.email,
          stage_setting: item.action === "review" ? null : item.stage_setting,
          action: item.action,
          isMe: cont.email === user.email,
        });
      });

      newContactList = isMe ? [me, ...myContacts] : [...myContacts];

      setContactListCopy(newContactList);
      setContactList(newContactList);
    }
  }, [user, contacts, isMe, t, tag, item]);

  const onFocus = () => {
    if (isReadOnly) {
      return;
    }
    if (refInput.current) {
      clearTimeout(refInput.current);
    }
    onParentFocus(tag, true);
    setIsCollapse(false);
  };

  const onBlur = () => {
    refInput.current = window.setTimeout(() => {
      onParentFocus(tag, false);
      setIsCollapse(true);
      onModify(typingItem);
    }, 0);
  };

  const onInputChange = (e) => {
    if (isReadOnly) {
      return;
    }
    const val = e.target.value;
    const isMe = tag === "email" ? val === user.email : item?.isMe;
    const itemNew = {
      ...item,
      [tag]: val,
      isMe,
    };

    setTypingItem(itemNew);

    if (val && val !== "") {
      const newList = contactListCopy.filter((lst) => {
        return lst.label !== "google" && lst[tag]?.indexOf(itemNew[tag]) > -1;
      });
      setContactList(newList);
    } else {
      setContactList(contactListCopy);
    }
  };

  const onAddContact = (itm) => {
    if (isReadOnly) {
      return;
    }
    const newItm = {
      uid: item.uid,
      key: item.key,
      ...itm,
    };
    setTypingItem(newItm);
    setIsCollapse(true);
  };

  if (!tag) {
    return null;
  }

  return (
    <InputAssigne
      position={position}
      tag={tag}
      isLoading={isLoading}
      isCollapse={isCollapse}
      contactList={contactList}
      inputAssigne={typingItem && tag ? typingItem[tag] : ""}
      onFocus={onFocus}
      onBlur={onBlur}
      onInputChange={onInputChange}
      onAddContact={onAddContact}
      isReadOnly={isReadOnly}
    />
  );
};

export default InputAssigneContainer;
