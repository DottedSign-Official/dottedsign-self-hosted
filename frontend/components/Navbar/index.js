import React from "react";
import Actions from "./Actions";
import Menu from "./Menu";
import More from "../../containers/More";
import HintExpire from "../HintExpire";
import { Wrapper, WrapperTitle, Title, WrapperMenu } from "./styled";
import propTypes from "./propTypes";

const Navbar = ({
  navbar,
  filename,
  fileFocus,
  isEnvelope,
  isGuestSign,
  showAction,
  showDropdownMenu,
  showOtherMenu,
}) => {
  return (
    <Wrapper>
      <WrapperTitle>
        <Title>{isEnvelope ? fileFocus?.fileName : filename}</Title>
        {navbar?.expiredReminder?.isVisible && (
          <HintExpire days={navbar?.expiredReminder?.days} />
        )}
      </WrapperTitle>
      <WrapperMenu>
        {navbar && (
          <>
            {showAction && <Actions {...navbar} />}
            {showDropdownMenu && <More menu={navbar.moreMenu} />}
            {showOtherMenu && <Menu {...navbar} isGuestSign={isGuestSign} />}
          </>
        )}
      </WrapperMenu>
    </Wrapper>
  );
};

Navbar.propTypes = propTypes;

export default Navbar;
