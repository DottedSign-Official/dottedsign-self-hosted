import React, { useRef, useState, useEffect } from "react";
import WindowWidth from "../../containers/WindowWidth";
import Item from "./Item";
import Branch from "./Branch";
import { Wrapper, WrapperInner } from "./styled";

const Progress = ({ windowWidth, isList, stages }) => {
  const [widthItem, setWidthItem] = useState(0);
  const [widthBranch, setWidthBranch] = useState(0);
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef && myRef.current && myRef.current.clientWidth > 0 && stages) {
      const widthContainer = myRef.current.clientWidth;
      const unitHead = isList ? 80 : 64;
      const numInView = Math.floor(widthContainer / (unitHead + 10));
      const isOverflow = stages.length > numInView;
      const actualInView = isOverflow ? numInView : stages.length;
      const distanceShift = isOverflow ? 10 : 0;
      setWidthItem(unitHead);
      setWidthBranch(`
        ${(widthContainer - unitHead) / (actualInView - 1) - distanceShift}px
      `);
    }
  }, [stages, windowWidth, isList]);

  return (
    <Wrapper ref={myRef} isList={isList}>
      <WrapperInner>
        {stages.map((step, idx) => {
          const branchType = step.branchType;

          if (!widthBranch || widthBranch < 1) {
            return null;
          }

          return (
            <React.Fragment key={idx}>
              <Item isList={isList} step={step} />
              {branchType && (
                <Branch
                  type={branchType}
                  width={widthBranch}
                  widthItem={widthItem}
                />
              )}
            </React.Fragment>
          );
        })}
      </WrapperInner>
    </Wrapper>
  );
};

export default WindowWidth(Progress);
