import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setConditions as setConditionsAction } from "../../../../redux/actions/search";
import tabObjs from "./data";
import Select from "../../../../containers/Select";
import { Wrapper } from "./styled";

const SearchTabs = ({ type }) => {
  const { currentTab } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const setConditions = (data) => dispatch(setConditionsAction(data));

  const onTabChange = (tab) => {
    setConditions({ currentTab: tab.key });
  };

  const tabs = tabObjs[type];

  return (
    <Wrapper>
      <Select
        activeItem={tabs.find((obj) => obj.key === currentTab)}
        items={tabs}
        indexKey="key"
        indexText="text"
        onSelectEvent={onTabChange}
        isFlat
      />
    </Wrapper>
  );
};

export default SearchTabs;
