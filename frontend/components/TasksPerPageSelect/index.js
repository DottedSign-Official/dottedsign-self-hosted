import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getPublicFormTasks as getPublicFormTasksAction } from "../../redux/actions/sign";
import { setPublicFormPerPage as setPublicFormPerPageAction } from "../../redux/actions/publicForm";

import Icon from "../Icon";

import {
  Wrapper,
  MenuItemDefault,
  WrapperIcon,
  Menu,
  MenuItem,
} from "./styled";

const PageSizeSelector = ({
  defaultPageSize = 10,
  options = [10, 20, 50, 100],
}) => {
  const dispatch = useDispatch();
  const getPublicFormTasks = (data) => dispatch(getPublicFormTasksAction(data));
  const setPublicFormPerPage = (perPage) =>
    dispatch(setPublicFormPerPageAction(perPage));
  const { tabActive, publicFormPerPage, publicFormSearchTerm } = useSelector(
    (state) => state.publicForm,
  );
  const [isCollapse, setIsCollapse] = useState(true);

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };
  const onCollapse = () => {
    setIsCollapse(true);
  };
  const onItemSelect = (val) => {
    setIsCollapse(true);
    setPublicFormPerPage(val);

    const cond = { category: tabActive, page: 1 };
    if (val) {
      cond.perPage = val;
    }
    if (publicFormSearchTerm) {
      cond.terms = publicFormSearchTerm;
    }

    getPublicFormTasks(cond);
  };
  return (
    <Wrapper onBlur={onCollapse}>
      <MenuItemDefault onClick={onToggle}>
        {publicFormPerPage || defaultPageSize}
        <WrapperIcon isCollapse={isCollapse}>
          <Icon type="chevDown" />
        </WrapperIcon>
      </MenuItemDefault>
      {!isCollapse && (
        <Menu onClick={(e) => e.preventDefault()}>
          {options.map((opt, idx) => (
            <MenuItem
              key={idx}
              isActive={publicFormPerPage === opt}
              onClick={() => onItemSelect(opt)}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default PageSizeSelector;
