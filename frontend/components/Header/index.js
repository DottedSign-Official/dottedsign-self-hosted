import React from "react";
import Button from "../Button";
import HeaderPanel from "../HeaderPanel";
import HeaderAux from "../../containers/HeaderAux";

import {
  Wrapper,
  WrapperInner,
  WrapperLogo,
  Logo,
  WrapperPanel,
  WrapperAux,
} from "./styled";

const Header = () => (
  <Wrapper>
    <WrapperInner>
      <WrapperLogo>
        <Button type="singleImg" url="/tasks">
          <Logo />
        </Button>
      </WrapperLogo>

      <WrapperPanel>
        <HeaderPanel />
      </WrapperPanel>

      <WrapperAux>
        <HeaderAux />
      </WrapperAux>
    </WrapperInner>
  </Wrapper>
);

export default Header;
