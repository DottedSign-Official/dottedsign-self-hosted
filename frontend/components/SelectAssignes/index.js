import React from "react";
import Icon from "../Icon";
import TagNumber from "../TagNumber";
import {
  WrapperAssignes,
  AssigneActive,
  WrapperDrop,
  Email,
  AssigneMenu,
  Assigne,
} from "./styled";

const EditAssignes = ({
  isCollapse,
  assignes,
  assigneFocus,
  onToggle,
  onSelect,
  onBlur,
}) => (
  <WrapperAssignes tabIndex="5666" onBlur={onBlur}>
    <AssigneActive id="Assign-Fields-Mailbox-GetSignatures" onClick={onToggle}>
      <TagNumber indx={assigneFocus.key} />
      <Email>
        {assigneFocus.role || assigneFocus.name || assigneFocus.email}
      </Email>
      <WrapperDrop isCollapse={isCollapse}>
        <Icon type="chevDown" />
      </WrapperDrop>
    </AssigneActive>

    {!isCollapse && (
      <AssigneMenu>
        {assignes.map((assigne) => (
          <Assigne key={assigne.key} onClick={() => onSelect(assigne)}>
            <TagNumber indx={assigne.key} />
            <Email>{assigne.role || assigne.name || assigne.email}</Email>
          </Assigne>
        ))}
      </AssigneMenu>
    )}
  </WrapperAssignes>
);

export default EditAssignes;
