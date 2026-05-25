import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLabels } from "../../redux/actions/label";
import { setLabels as setLabelsAction } from "../../redux/actions/create";
import EditLabels from "../../components/EditLabels";

const EditLabelsContainer = () => {
  const labels = useSelector((state) => state.label.labels);
  const labelsSelected = useSelector((state) => state.create.labels);
  const dispatch = useDispatch();
  const setLabels = (data) => dispatch(setLabelsAction(data));

  useEffect(() => {
    if (!labels) {
      dispatch(getLabels());
    }
  }, [labels, dispatch]);

  const onLabelChange = (operation, tag) => {
    let updatedLabels;
    if (operation === "add") {
      updatedLabels = [...(labelsSelected || []), tag];
    }
    if (operation === "delete") {
      updatedLabels = labelsSelected.filter((t) => t !== tag);
    }
    setLabels(updatedLabels);
  };

  if (!labels || (labels && labels.length < 1)) {
    return null;
  }
  return (
    <EditLabels labelsSelected={labelsSelected} onUpdate={onLabelChange} />
  );
};

export default EditLabelsContainer;
