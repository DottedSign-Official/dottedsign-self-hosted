import React from "react";
import ReactDOM from "react-dom";
import { coord2Styles } from "../../../../../helpers/coord2Styles";
import { Wrapper, WrapperContent } from "../styled";

const Holder = ({ viewport, createdObj, onObjFocus, children }) => {
  const page = document.getElementById(`pageContainer${createdObj.page}`);
  if (!page) {
    return null;
  }
  const Container = page;

  const styles = coord2Styles(createdObj.coords, viewport);

  const isGroupHolder = createdObj.field_group_object_id;

  const Content = (
    <Wrapper
      style={styles}
      isGroupHolder={isGroupHolder}
      onMouseDown={() => onObjFocus(createdObj)}
    >
      <WrapperContent>{children}</WrapperContent>
    </Wrapper>
  );

  return ReactDOM.createPortal(Content, Container);
};

export default Holder;
