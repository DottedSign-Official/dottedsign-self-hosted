import React from "react";
import { useSelector } from "react-redux";
import { isExist } from "../../helpers/others";
import SearchBar from "./SearchBar";
import Items from "./Items";
import Pagination from "./Pagination";
import { Wrapper } from "./styled";

const SearchContent = ({
  labels,
  onSearch,
  setConditions,
  onModalOpen,
  onManageLabel,
}) => {
  const { isLoading, tasksSearch } = useSelector((state) => state.search);
  const isPlaceholder = !isExist(tasksSearch) || isLoading;

  return (
    <Wrapper>
      <SearchBar
        myLabels={labels}
        onSearch={onSearch}
        setConditions={setConditions}
      />
      <Items
        isPlaceholder={isPlaceholder}
        onModalOpen={onModalOpen}
        onManageLabel={onManageLabel}
      />
      {!isPlaceholder && <Pagination onSearch={onSearch} />}
    </Wrapper>
  );
};

export default SearchContent;
