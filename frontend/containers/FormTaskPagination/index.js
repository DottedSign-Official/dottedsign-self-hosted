import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPublicFormTasks as getPublicFormTasksAction } from "../../redux/actions/sign";
import Pagination from "../../components/Pagination";

const FormTaskPagination = () => {
  const dispatch = useDispatch();
  const getPublicFormTasks = (data) => dispatch(getPublicFormTasksAction(data));

  const isLoading = useSelector((state) => state.sign.isLoadingAllTasks);
  const { focusPageAll, focusPage } = useSelector((state) => state.sign);
  const { tabActive, publicFormPerPage } = useSelector(
    (state) => state.publicForm,
  );

  const onTabClick = (idx) => {
    const cond = {
      category: tabActive,
      page: idx,
      perPage: publicFormPerPage,
    };

    getPublicFormTasks(cond);
  };

  if (isLoading || focusPageAll < 1) {
    return null;
  }

  return (
    <Pagination pages={focusPageAll} page={focusPage} onTabClick={onTabClick} />
  );
};

export default FormTaskPagination;
