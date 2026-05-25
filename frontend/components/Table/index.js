import React from "react";
import { BlockContent, Value, Wrapper } from "./styled";

const parser = (value) => {
  if (value === true) {
    return "True";
  }
  if (value === false) {
    return "False";
  }
  if (value === null) {
    return "N/A";
  }
  if (Array.isArray(value)) {
    return <Table data={value} />;
  }
  return value;
};

const Table = ({ data, widths = [], onClick = null }) => (
  <Wrapper>
    {data.map((detail, idx) => (
      <BlockContent
        key={idx}
        isClickable={!!onClick}
        onClick={idx && onClick ? () => onClick(detail) : () => {}}
      >
        {Object.values(detail).map((value, indx) => (
          <React.Fragment key={indx}>
            <Value width={widths[indx]}>{parser(value)}</Value>
          </React.Fragment>
        ))}
      </BlockContent>
    ))}
  </Wrapper>
);

export default Table;
