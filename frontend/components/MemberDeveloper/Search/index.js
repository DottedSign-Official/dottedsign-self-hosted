import { useState } from "react";
import { useTranslation } from "next-i18next";

import Icon from "../../Icon";
import Select from "../../../containers/Select";

import { Input } from "../../../global/styledForm";
import { SearchBarContainer, SearchWrapper } from "./styled";

const Search = ({
  onSearch,
  searchTypes,
  handleSelect,
  selectedSearchItem,
}) => {
  const { t } = useTranslation("developer");
  const [content, setContent] = useState("");

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSearch(content);
    }
  };

  return (
    <SearchBarContainer>
      <SearchWrapper>
        <Select
          activeItem={selectedSearchItem}
          items={searchTypes}
          indexKey="value"
          indexText="text"
          onSelectEvent={handleSelect}
        />
        <Input
          placeholder={t("type_content_to_search", { ns: "common" })}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => onSearch(content)}>
          <Icon type="search" />
        </button>
      </SearchWrapper>
    </SearchBarContainer>
  );
};

export default Search;
