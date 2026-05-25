import React, { useState } from "react";
import Gird from "./Grid";
import List from "./List";
import {
  GridWrapper,
  ToolWrapper,
  IconWrapper,
  PaginationWrapper,
} from "./styled";
import ModeSwitch, { TYPE } from "../ModeSwitch";
import Pagination from "../Pagination";

const TaskListDeveloper = ({
  tasks,
  onSearch,
  currentPage,
  pages,
  onPageChange,
  getMenu,
  t,
}) => {
  const [mode, setMode] = useState(TYPE.GIRD);

  return (
    <>
      {tasks && tasks.length ? (
        <ToolWrapper>
          <IconWrapper>
            <ModeSwitch mode={mode} setMode={setMode} />
          </IconWrapper>
        </ToolWrapper>
      ) : null}
      {tasks && tasks.length > 0 ? (
        <>
          {mode === TYPE.GIRD && (
            <GridWrapper>
              <Gird tasks={tasks} onClick={onSearch} getMenu={getMenu} />
            </GridWrapper>
          )}
          {mode === TYPE.LIST && (
            <List tasks={tasks} onClick={onSearch} getMenu={getMenu} />
          )}
          <PaginationWrapper>
            <Pagination
              page={currentPage}
              pages={pages}
              onTabClick={onPageChange}
            />
          </PaginationWrapper>
        </>
      ) : (
        <GridWrapper>{t("empty_list")}</GridWrapper>
      )}
    </>
  );
};

export default TaskListDeveloper;
