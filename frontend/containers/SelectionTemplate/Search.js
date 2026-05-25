import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import Icon from "../../components/Icon";
import Select from "../../containers/Select";

import { setSearchContent, setSearchItem } from "../../redux/actions/template";

import { TEMPLATE_SEARCH_TYPE } from "../../constants/constants";

import { Input } from "../../global/styledForm";
import { SearchBarContainer, SearchWrapper } from "./styled";

const getSearchItems = (t) => {
  return [
    {
      value: TEMPLATE_SEARCH_TYPE.code,
      text: t("template_search_code"),
    },
    {
      value: TEMPLATE_SEARCH_TYPE.name,
      text: t("template_search_name"),
    },
  ];
};

const Search = () => {
  const { t } = useTranslation("common");
  const searchItems = getSearchItems(t);
  const { searchContent, searchType } = useSelector((state) => state.template);
  const activeItem = searchItems.find((item) => item?.value === searchType);
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSearch = () => {
    dispatch(setSearchContent(content));
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleSelect = (item) => {
    dispatch(setSearchItem(item.value));
  };

  useEffect(() => {
    setContent(searchContent);
  }, [searchContent]);

  return (
    <SearchBarContainer>
      <SearchWrapper>
        <Select
          activeItem={activeItem}
          items={searchItems}
          indexKey="value"
          indexText="text"
          onSelectEvent={handleSelect}
        />
        <Input
          placeholder={t("type_content_to_search")}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>
          <Icon type="search" />
        </button>
      </SearchWrapper>
    </SearchBarContainer>
  );
};

export default Search;
