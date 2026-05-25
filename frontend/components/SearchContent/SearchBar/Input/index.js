import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { setConditions as setConditionsAction } from "../../../../redux/actions/search";
import Icon from "../../../Icon";
import { Wrapper, Search, SearchIcon } from "./styled";

const SearchInput = ({ onSearch }) => {
  const { t } = useTranslation("common");

  const [isFocus, setIsFocus] = useState(false);
  const { currentTab, keyword } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const setConditions = (data) => dispatch(setConditionsAction(data));

  // NOTE: input
  const onInputFocus = () => {
    setIsFocus(true);
  };

  const onInputBlur = (e) => {
    if (e.relatedTarget) {
      return;
    }
    setIsFocus(false);
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setConditions({ keyword: val });
  };

  const onInputClear = () => {
    setConditions({ keyword: "" });
  };

  const onKeyEvent = (e) => {
    if (e.keyCode === 13) {
      onSearch();
      setIsFocus(false);
    }
  };

  return (
    <Wrapper tabIndex="5566" onMouseDown={onInputFocus}>
      <Search
        id="searchBar"
        isFocus={isFocus}
        value={keyword}
        onBlur={onInputBlur}
        onKeyDown={onKeyEvent}
        onChange={onInputChange}
        placeholder={t(`search_placeholder_${currentTab}`)}
      />

      {isFocus && (
        <SearchIcon onClick={onInputClear}>
          <Icon type="cancel" />
        </SearchIcon>
      )}
    </Wrapper>
  );
};

export default SearchInput;
