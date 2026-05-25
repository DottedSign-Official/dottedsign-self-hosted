import React from "react";
import Icon from "../Icon";
import { Wrapper, Ref } from "./styled";

const ListReferences = ({ references, onNav }) => {
  if (!references) {
    return null;
  }

  return (
    <Wrapper>
      {references.map((ref, idx) => (
        <Ref
          key={idx}
          isNav={onNav !== null}
          onClick={onNav ? () => onNav(idx) : () => null}
        >
          <Icon type="menuDownload" />
          <p>{ref.file_name || ref.file.name}</p>
        </Ref>
      ))}
    </Wrapper>
  );
};

export default ListReferences;
