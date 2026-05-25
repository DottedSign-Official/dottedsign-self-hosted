import React from "react";
import Icon from "../../Icon";
import { signToBase64Src } from "../../../helpers/base64";
import { Wrapper, Item, WrapperClear } from "./styled";

const SignItem = ({ isActive, sign, onSignDelete, onSignSelect, children }) => (
  <Wrapper>
    {sign.raw ? (
      <>
        <Item
          key={sign.id}
          isActive={isActive}
          onMouseDown={() => onSignSelect(sign)}
        >
          <img src={signToBase64Src(sign)} alt="img-sign" />
        </Item>
        {isActive && (
          <WrapperClear onClick={() => onSignDelete(sign.id)}>
            <Icon type="close" size="18px" />
          </WrapperClear>
        )}
      </>
    ) : (
      <Item key={sign.id} onClick={() => onSignSelect(sign)}>
        {children}
      </Item>
    )}
  </Wrapper>
);

export default SignItem;
