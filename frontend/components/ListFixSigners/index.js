import React from "react";
import Input from "../../containers/Input";
import TagNumber from "../TagNumber";
import { WrapperList } from "../../global/styledCreate";
import Icon from "../Icon";
import { Wrapper, OrderNumLinkBar, ColTag, ColName, ColMore } from "./styled";

const List = ({ list, isOrder, isMore, onNameChange, onMore }) => {
  if (!list || list.length < 1) {
    return null;
  }

  return (
    <Wrapper>
      {list.map((itm, idx) => (
        <WrapperList key={itm.order || itm.key || idx}>
          {isOrder && itm.key > 0 && <OrderNumLinkBar />}

          <ColTag>
            <TagNumber indx={itm.key} />
          </ColTag>

          <ColName isMore={isMore}>
            <Input
              placeholder={"role"}
              value={itm.name}
              onSubmit={onNameChange(itm)}
            />
          </ColName>
          {isMore && (
            <ColMore onClick={() => onMore(itm)}>
              <Icon type="more" />
            </ColMore>
          )}
        </WrapperList>
      ))}
    </Wrapper>
  );
};

export default List;
