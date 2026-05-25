import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks as getTasksAction } from "../../redux/actions/sign";
import Pagination from "../../components/Pagination";

const TaskPagination = () => {
  const isLoading = useSelector((state) => state.sign.isLoadingAllTasks);
  const { filter, focus, focusPageAll, focusPage } = useSelector(
    (state) => state.sign,
  );
  const dispatch = useDispatch();
  const getTasks = (data) => dispatch(getTasksAction(data));

  const onTabClick = (idx) => {
    const cond = {
      category: focus,
      page: idx,
    };

    if (filter) {
      cond.filter = filter;
    }
    getTasks(cond);
  };

  if (isLoading || focusPageAll < 1) {
    return null;
  }

  return (
    <Pagination pages={focusPageAll} page={focusPage} onTabClick={onTabClick} />
  );
};

export default TaskPagination;
