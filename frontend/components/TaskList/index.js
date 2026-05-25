import React from "react";
import { isExist } from "../../helpers/others";
import BtnTask from "../../containers/BtnTask";
import TaskItem from "../../containers/TaskItem";
import ModeSwitch from "../../containers/ModeSwitch";
import Refresh from "../../containers/TaskRefresh";
import LoaderGrid from "../Loaders/TaskItemGrid";
import LoaderList from "../Loaders/TaskItemList";
import Blank from "../Blank";
import TaskFilter from "../TaskFilter";
import WindowWidth from "../../containers/WindowWidth";
import {
  Wrapper,
  WrapperBtnTask,
  Toolbar,
  ToolbarSub,
  Content,
  TaskWrapper,
} from "./styled";
import propTypes from "./propTypes";

const TaskList = ({
  isVerified,
  isLoading,
  focus,
  mode,
  allTasks,
  isMobile,
}) => {
  const taskContent = (() => {
    if (!isLoading && isExist(allTasks) && allTasks.length < 1) {
      return <Blank type={focus} />;
    }

    if (!isLoading && isExist(allTasks) && allTasks.length > 0) {
      return (
        <TaskWrapper>
          {allTasks.map((task, idx) => (
            <TaskItem
              key={idx}
              task={task}
              isMenuUpward={allTasks.length > 5 && allTasks.length - idx < 4}
            />
          ))}
        </TaskWrapper>
      );
    }

    let Card;
    if (mode === "list") {
      Card = LoaderList;
    } else {
      Card = LoaderGrid;
    }

    return (
      <TaskWrapper>
        {[...Array(8)].map((_, idx) => (
          <Card key={idx} />
        ))}
      </TaskWrapper>
    );
  })();

  return (
    <Wrapper>
      <Toolbar>
        <ToolbarSub>
          {(focus === "waiting_for_me" || focus === "waiting_for_others") && (
            <TaskFilter />
          )}
        </ToolbarSub>
        <ToolbarSub isRight>
          <ModeSwitch />
          <Refresh />
        </ToolbarSub>
      </Toolbar>

      <Content>{taskContent}</Content>

      {isVerified && !isMobile && (
        <WrapperBtnTask>
          <BtnTask />
        </WrapperBtnTask>
      )}
    </Wrapper>
  );
};

TaskList.propTypes = propTypes;

export default WindowWidth(TaskList);
