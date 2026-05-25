import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import TaskItemGrid from "../../components/TaskItemGrid";
import TaskItemList from "../../components/TaskItemList";

const TaskItem = ({ task, isMenuUpward }) => {
  const Router = useRouter();

  const { mode } = useSelector((state) => state.sign);

  const isEnvelope = !!task.envelope_id;

  const Item = (() => {
    if (mode === "grid") {
      return TaskItemGrid;
    } else if (mode === "list") {
      return TaskItemList;
    } else {
      return null;
    }
  })();

  const onNav = () => {
    Router.push(task.link);
  };

  return (
    <Item
      task={task}
      onNav={onNav}
      isMenuUpward={isMenuUpward}
      isEnvelope={isEnvelope}
    />
  );
};

export default TaskItem;
