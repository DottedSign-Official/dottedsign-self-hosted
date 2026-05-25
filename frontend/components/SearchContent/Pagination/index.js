import React from "react";
import { useSelector } from "react-redux";
import Pagination from "../../Pagination";
import { WrapperPagination } from "./styled";

const SearchContent = ({ onSearch }) => {
  const { totalPages, currentPage } = useSelector((state) => state.search);

  const onPageChange = (page) => {
    onSearch({ page });
  };

  return (
    <WrapperPagination>
      <Pagination
        pages={totalPages}
        page={currentPage}
        onTabClick={onPageChange}
      />
    </WrapperPagination>
  );
};

export default SearchContent;
