import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTasks } from "../../redux/actions/sign";
import TaskListComponent from "../../components/TaskList";

const TaskListContainer = () => {
  const isVerified = useSelector((state) => state.auth.isVerified);
  const isLoading = useSelector((state) => state.sign.isLoadingAllTasks);
  const { allTasksFocus, focus, mode } = useSelector((state) => state.sign);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  return (
    <TaskListComponent
      isVerified={isVerified}
      isLoading={isLoading}
      focus={focus}
      mode={mode}
      allTasks={allTasksFocus}
    />
  );
};

export default TaskListContainer;
