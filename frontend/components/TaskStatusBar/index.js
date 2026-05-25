import React from "react";
import { useTranslation } from "next-i18next";
import { TASK_STATUS_BAR_ITEMS } from "../../constants/constants";
import Loader from "../Loaders/TaskStatusBar";
import Icon from "../Icon";
import TaskMenu from "./Menu";
import { Wrapper, ItemActive, Text, WrapperIcon, WrapperMenu } from "./styled";

const TaskStatusBar = ({
  isLoading,
  isCollapse,
  setIsCollapse,
  windowWidth,
  focus,
  setFocus,
  typeCounter,
}) => {
  const { t } = useTranslation("common");
  const isMobile = windowWidth < 768;
  if (!isLoading && windowWidth && windowWidth > 0) {
    if (isMobile) {
      return (
        <Wrapper>
          <ItemActive onClick={() => setIsCollapse(!isCollapse)}>
            <Text colorTag={focus}>
              {`${t(TASK_STATUS_BAR_ITEMS[focus])} (${typeCounter[focus]})`}
            </Text>
            <WrapperIcon isCollapse={isCollapse}>
              <Icon type="chevDown" />
            </WrapperIcon>
          </ItemActive>

          {!isCollapse && (
            <WrapperMenu>
              <TaskMenu
                focus={focus}
                setFocus={setFocus}
                typeCounter={typeCounter}
              />
            </WrapperMenu>
          )}
        </Wrapper>
      );
    } else {
      return (
        <TaskMenu focus={focus} setFocus={setFocus} typeCounter={typeCounter} />
      );
    }
  }

  return (
    <Wrapper>
      <Loader isMobile={isMobile} />
    </Wrapper>
  );
};

export default TaskStatusBar;
