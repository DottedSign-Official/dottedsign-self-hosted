import React from "react";
import { useTranslation } from "next-i18next";
import Loader from "../Loaders/ItemContact";
import { Input } from "../../global/styledForm";
import { Wrapper, Menu, MenuItem } from "./styled";

const InputAssignes = ({
  tag,
  isLoading,
  contactList,
  isCollapse,
  inputAssigne,
  onFocus,
  onBlur,
  onInputChange,
  onAddContact,
  isReadOnly,
}) => {
  const { t } = useTranslation("common");

  const contactItem = (cont) => (
    <MenuItem
      className="contactItem"
      onClick={() => onAddContact(cont)}
      isMe={cont.isMe}
    >
      {cont.label}
    </MenuItem>
  );

  return (
    <>
      <Wrapper tabIndex="566" onFocus={onFocus} onBlur={onBlur}>
        <Input
          tabIndex="566"
          type="text"
          onChange={onInputChange}
          placeholder={t(tag)}
          value={inputAssigne}
          autocomplete="off"
          readOnly={isReadOnly}
        />

        {!isReadOnly && !isCollapse && (
          <Menu className="contactMenu">
            {isLoading ? (
              <>
                <Loader />
                <Loader />
                <Loader />
              </>
            ) : (
              contactList.map((cont, idx) => (
                <React.Fragment key={idx}>{contactItem(cont)}</React.Fragment>
              ))
            )}
          </Menu>
        )}
      </Wrapper>
    </>
  );
};

export default InputAssignes;
