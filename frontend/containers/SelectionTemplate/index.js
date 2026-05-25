import React, { useRef, useState, useEffect } from "react";
import WindowWidth from "../WindowWidth";
import Tags from "./Tags";
import Items from "./Items";
import Pages from "./Pages";
import Search from "./Search";
import { Wrapper, WrapperInner } from "./styled";

const SelectionTemplate = ({ windowWidth, isPlaceholder, isManageable }) => {
  const wrapperRef = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(null);

  useEffect(() => {
    if (windowWidth && windowWidth > 0) {
      setWrapperWidth(wrapperRef.current && wrapperRef.current.clientWidth);
    }
  }, [windowWidth]);

  return (
    <Wrapper ref={wrapperRef}>
      <WrapperInner wrapperWidth={wrapperWidth}>
        <Tags isManageable={isManageable} />
        <Search />
        <Items isPlaceholder={isPlaceholder} isManageable={isManageable} />
        <Pages />
      </WrapperInner>
    </Wrapper>
  );
};

export default WindowWidth(SelectionTemplate);
