import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFocus as setFocusAction,
  getTasks as getTasksAction,
} from "../../redux/actions/sign";
import { TASK_STATUS_BAR_ITEMS } from "../../constants/constants";
import WindowWidth from "../WindowWidth";
import TaskStatusBarComponent from "../../components/TaskStatusBar";

const TaskStatusBarContainer = ({ windowWidth }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const [types, setTypes] = useState([]);
  const { isLoadingAllTasks, focus, taskSummary } = useSelector(
    (state) => state.sign,
  );
  const dispatch = useDispatch();
  const setFocus = (data) => dispatch(setFocusAction(data));
  const getTasks = (data) => dispatch(getTasksAction(data));

  const onSetFocus = (key) => {
    setFocus(key);

    setIsCollapse(true);

    const cond = {
      category: key,
      page: 1,
    };

    getTasks(cond);
  };

  useEffect(() => {
    let typeCounter = {};
    Object.keys(TASK_STATUS_BAR_ITEMS).forEach((key) => {
      typeCounter[key] = taskSummary && taskSummary[key] ? taskSummary[key] : 0;
    });
    setTypes(typeCounter);
  }, [taskSummary]);

  return (
    <TaskStatusBarComponent
      isLoading={isLoadingAllTasks}
      isCollapse={isCollapse}
      setIsCollapse={setIsCollapse}
      windowWidth={windowWidth}
      focus={focus}
      setFocus={onSetFocus}
      typeCounter={types}
    />
  );
};

export default WindowWidth(TaskStatusBarContainer);
