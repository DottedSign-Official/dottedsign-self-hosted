import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  setFilter as setFilterAction,
  getTasks as getTasksAction,
} from "../../redux/actions/sign";
import { taskFilter } from "../../constants/constants";
import Icon from "../Icon";

import {
  Wrapper,
  MenuItemDefault,
  WrapperIcon,
  Menu,
  MenuItem,
} from "./styled";

const FilterTasks = () => {
  const { t } = useTranslation("tasks");

  const [isCollapse, setIsCollapse] = useState(true);
  const { filter, focus } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const setFilter = (data) => dispatch(setFilterAction(data));
  const getTasks = (data) => dispatch(getTasksAction(data));

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };
  const onCollapse = () => {
    setIsCollapse(true);
  };
  const onItemSelect = (val) => {
    setIsCollapse(true);
    setFilter(val);

    const cond = { category: focus, page: 1 };
    if (val) {
      cond.filter = val;
    }
    getTasks(cond);
  };

  return (
    <Wrapper tabIndex="1230" onBlur={onCollapse}>
      <MenuItemDefault onClick={onToggle}>
        {t(`filter_${filter ? filter : "all"}`)}
        <WrapperIcon isCollapse={isCollapse}>
          <Icon type="chevDown" />
        </WrapperIcon>
      </MenuItemDefault>
      {!isCollapse && (
        <Menu onClick={(e) => e.preventDefault()}>
          <MenuItem isActive={!filter} onClick={() => onItemSelect(null)}>
            {t("filter_all")}
          </MenuItem>
          {Object.keys(taskFilter).map((key, idx) => (
            <MenuItem
              key={idx}
              isActive={filter === taskFilter[key]}
              onClick={() => onItemSelect(taskFilter[key])}
            >
              {t(`filter_${key}`)}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default FilterTasks;
