import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOverall as getOverallAction } from "../../redux/actions/sign";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const RefreshContainer = () => {
  const { filter, focus } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const getOverall = (data) => dispatch(getOverallAction(data));

  const onRefresh = () => {
    const cond = {
      category: focus,
      page: 1,
    };

    if (filter) {
      cond.filter = filter;
    }
    getOverall(cond);
  };

  return (
    <Button type="icon" handleEvent={onRefresh}>
      <Icon type="modeRefresh" />
    </Button>
  );
};

export default RefreshContainer;
