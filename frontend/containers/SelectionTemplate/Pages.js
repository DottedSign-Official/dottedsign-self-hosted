import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPage as setPageAction } from "../../redux/actions/template";
import Pagination from "../../components/Pagination";

const Pages = () => {
  const { pageFocus, pageAll } = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const setPage = (data) => dispatch(setPageAction(data));

  return <Pagination page={pageFocus} pages={pageAll} onTabClick={setPage} />;
};

export default Pages;
