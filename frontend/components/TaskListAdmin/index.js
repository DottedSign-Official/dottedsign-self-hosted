import React from "react";
import { useTranslation } from "next-i18next";
import TaskItem from "../TaskItemList";
import { Wrapper, Placeholder } from "./styled";
import propTypes from "./propTypes";

const TaskListAdmin = ({ tasksAdmin, onNav }) => {
  const { t } = useTranslation("admin");

  return (
    <Wrapper>
      {tasksAdmin && tasksAdmin.length > 0 ? (
        tasksAdmin.map((task, idx) => (
          <TaskItem
            key={idx}
            task={task}
            onNav={() => onNav(task)}
            isMoreHide
          />
        ))
      ) : (
        <Placeholder>{t("placeholder_list")}</Placeholder>
      )}
    </Wrapper>
  );
};

TaskListAdmin.propTypes = propTypes;

export default TaskListAdmin;
