import React, { Fragment } from "react";
import Icon from "../Icon";
import { Wrapper, TagNav, Tag, Dot } from "./styled";

const Pagination = ({ pages, page, onTabClick }) => {
  const isNavLeftVisible = pages && pages > 1 && page && page > 1;
  const isNavRightVisible = pages && pages > 1 && page && page < pages;

  if (!pages || pages <= 1) {
    return null;
  }
  return (
    <Wrapper>
      <TagNav
        isVisible={isNavLeftVisible}
        onClick={isNavLeftVisible ? () => onTabClick(page - 1) : () => {}}
      >
        <Icon type="BackPurple" />
      </TagNav>

      {[...Array(pages)].map((_, idx) => {
        const isNumVisible =
          idx + 1 === 1 ||
          idx + 1 === pages ||
          (page <= 4 && idx + 1 <= 4) ||
          (page > 4 &&
            page + 1 <= pages - 3 &&
            Math.abs(page - (idx + 1)) <= 1) ||
          (page > pages - 4 && idx + 1 > pages - 4);

        const isDotLeft = idx === 0 && pages > 6 && page > 4;
        const isDotRight = idx + 1 === pages && pages > 6 && pages - page >= 4;

        return (
          <Fragment key={idx}>
            {isDotRight && (
              <Dot>
                <Icon type="moreHorizontalPurple" />
              </Dot>
            )}

            {isNumVisible && (
              <Tag
                key={idx}
                isActive={idx + 1 === page}
                onClick={() => onTabClick(idx + 1)}
              >
                {idx + 1}
              </Tag>
            )}

            {isDotLeft && (
              <Dot>
                <Icon type="moreHorizontalPurple" />
              </Dot>
            )}
          </Fragment>
        );
      })}

      <TagNav
        isVisible={isNavRightVisible}
        onClick={isNavRightVisible ? () => onTabClick(page + 1) : null}
      >
        <Icon type="NextPurple" />
      </TagNav>
    </Wrapper>
  );
};

export default Pagination;
