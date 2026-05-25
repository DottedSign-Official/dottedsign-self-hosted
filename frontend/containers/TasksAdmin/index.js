import React from "react";
import { useSelector } from "react-redux";

import LoaderLabel from "../../components/Loaders/Label";
import Loader from "../../components/Loaders/AdminUserList";
import SelectUsersAdmin from "../SelectUsersAdmin";
import DateRange from "../DateRangeAdmin";
import TaskList from "../TaskListAdmin";

const TasksAdmin = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user?.current_permission) {
    return (
      <>
        <LoaderLabel />
        <Loader />
      </>
    );
  }

  return (
    <>
      <SelectUsersAdmin />
      <DateRange />
      <TaskList />
    </>
  );
};

export default TasksAdmin;
