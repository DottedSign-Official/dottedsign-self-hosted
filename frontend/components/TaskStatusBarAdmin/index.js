import React from "react";
import { useTranslation } from "next-i18next";
import { Wrapper, Tab, Text, Count } from "./styled";

const TaskStatusBar = ({ focusGroup, tasksSummaryAdmin, onTabClick }) => {
  const { t } = useTranslation("admin");
  return (
    <Wrapper>
      {tasksSummaryAdmin.map((tab, idx) => {
        let isActive = tab.key === focusGroup;

        return (
          <Tab
            key={idx}
            isActive={isActive}
            onClick={() => onTabClick(tab.key)}
          >
            <Text>{t(tab.text)}</Text>
            <Count>{tab.count}</Count>
          </Tab>
        );
      })}
    </Wrapper>
  );
};

export default TaskStatusBar;
