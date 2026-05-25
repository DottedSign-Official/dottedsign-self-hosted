import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { coordsAdjust } from "../../../../../helpers/coord2Styles";
import Icon from "../../../../Icon";
import { WrapperContent } from "../styled";
import { IconPanel, WrapperIcon, Resize, Border } from "./styled";
import { zIndices } from "../../../../../global/styled";

const Holder = ({
  onMore,
  scale,
  viewport,
  createdObj,
  orderObj,
  children,
  onObjBlur,
  onObjUpdate,
  onObjDel,
  Container,
  isGroupFocusEditing,
  setIsGroupFocusEditing,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onFocus = useCallback(() => {
    const ele = document.getElementById(`holder-${createdObj.id}`);
    if (ele) {
      ele.focus();
    }
  }, [createdObj.id]);

  const onDragStart = () => {
    setIsEditing(true);
  };
  const onDragStop = (e, data) => {
    const oriCoords = createdObj.coords;
    const oriw = oriCoords[2] - oriCoords[0];
    const orih = oriCoords[3] - oriCoords[1];

    // NOTE: x, y top-left
    let coords = [
      data.x,
      viewport.height - data.y - orih,
      data.x + oriw,
      viewport.height - data.y,
    ];

    const newObj = {
      ...createdObj,
      coords: coordsAdjust(coords, viewport),
    };

    onObjUpdate(newObj);
    setIsEditing(false);
  };

  const onResizeStart = () => {
    setIsEditing(true);
    setIsGroupFocusEditing(true);
  };
  const onResizeStop = (e, direction, ref, d) => {
    const coord = createdObj.coords;
    const newObj = {
      ...createdObj,
      coords: [coord[0], coord[1] - d.height, coord[2] + d.width, coord[3]],
    };
    onObjUpdate(newObj);
    setIsEditing(false);
    setIsGroupFocusEditing(false);
    onFocus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFocus();
    }, 100);

    return () => clearTimeout(timer);
  }, [onFocus]);

  const size = {
    width: createdObj.coords[2] - createdObj.coords[0],
    height: createdObj.coords[3] - createdObj.coords[1],
  };

  const position = {
    x: createdObj.coords[0],
    y: viewport.height - createdObj.coords[3], // NOTE: matching top-left
  };

  const isGroupHolder = createdObj.field_group_object_id;

  const Content = (
    <Rnd
      scale={scale}
      size={size}
      position={position}
      style={{
        position: "absolute",
        opacity: "1",
        zIndex: isGroupHolder ? zIndices.groupHolder : zIndices.holder,
      }}
      minWidth={createdObj.is_date && createdObj.type === "textfield" ? 54 : 14}
      minHeight={14}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      lockAspectRatio={
        createdObj.type === "checkbox" || createdObj.type === "radio"
      }
      enableResizing={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <WrapperContent
        id={`holder-${createdObj.id}`}
        tabIndex={123}
        onBlur={isEditing || isGroupFocusEditing ? null : onObjBlur}
      >
        <Border indx={orderObj} readOnly={createdObj.options.read_only}>
          {children}

          <IconPanel>
            <WrapperIcon
              indx={orderObj}
              onClick={onObjDel}
              readOnly={createdObj.options.read_only}
            >
              <Icon type="close" size="16px" />
            </WrapperIcon>

            {onMore && !isGroupHolder && (
              <WrapperIcon
                indx={orderObj}
                onClick={onMore}
                readOnly={createdObj.options.read_only}
              >
                <Icon type="moreHorizontalWhite" size="16px" />
              </WrapperIcon>
            )}
          </IconPanel>
          <Resize indx={orderObj} isDisabled={createdObj.options.read_only} />
        </Border>
      </WrapperContent>
    </Rnd>
  );

  return ReactDOM.createPortal(Content, Container);
};

const PropsValidator = (props) => {
  const page = document.getElementById(`pageContainer${props.createdObj.page}`);
  if (!page) {
    return null;
  }
  return <Holder {...props} Container={page} />;
};

export default PropsValidator;
