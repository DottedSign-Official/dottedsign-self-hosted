import React from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { coord2Styles } from "../../helpers/coord2Styles";
import { FieldGroupItem } from "./styled";

const FieldsGroup = ({ groups, isEnvelope, fileFocus }) => {
  const vp = useSelector((state) => state.pdf.viewport);

  const getStyles = (page, coord) => {
    const viewport = vp[page - 1];
    const styles = coord2Styles(coord, viewport);

    return styles;
  };

  if (!vp) {
    return null;
  }

  return Object.keys(groups).map((key) => {
    const { order, page, coord, isRequired, isEditable, groupId, taskId } =
      groups[key];

    if (isEnvelope && fileFocus?.fileId !== taskId) {
      return null;
    }

    const wrapper = document.getElementById(`pageContainer${page}`);

    if (!wrapper) {
      return null;
    }

    const styles = getStyles(page, coord);

    const content = (
      <FieldGroupItem
        id={groupId} // NOTE: id is for focus effect in Sign/styled.js
        order={order}
        style={styles}
        isRequired={isRequired}
        isEditable={isEditable}
      />
    );

    return ReactDOM.createPortal(content, wrapper);
  });
};

export default FieldsGroup;
