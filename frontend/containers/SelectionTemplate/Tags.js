import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLabel as setLabelAction } from "../../redux/actions/template";
import ListTags from "../ListTags";

const Tags = ({ isManageable }) => {
  const { labels } = useSelector((state) => state.label);
  const { labelFocus } = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const setLabel = useCallback(
    (data) => dispatch(setLabelAction(data)),
    [dispatch],
  );

  const onLabelFocus = (data) => {
    if (labels.indexOf(data) === -1) {
      return;
    }

    let toUpdate;
    if (labelFocus.indexOf(data) > -1) {
      toUpdate = labelFocus.filter((tag) => tag !== data);
    } else {
      toUpdate = [...labelFocus, data];
    }

    return setLabel(toUpdate);
  };

  const onClear = () => {
    return setLabel([]);
  };

  return (
    <ListTags
      labelFocus={labelFocus}
      onLabelFocus={onLabelFocus}
      onClear={onClear}
      isManageable={isManageable}
    />
  );
};

export default Tags;
