import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLabels } from "../../redux/actions/label";
import { isExist } from "../../helpers/others";
import Loader from "../../components/Loaders/Tags";
import ListTag from "../../components/ListTags";

const Tags = ({ labelFocus, onLabelFocus, onClear, isManageable }) => {
  const [isExpand, setIsExpand] = useState(false);
  const [labels, setLabels] = useState(null);
  const labelsOri = useSelector((state) => state.label.labels);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLabels());
  }, [dispatch]);

  useEffect(() => {
    if (labelsOri) {
      const allLabels = [
        ...labelFocus,
        ...labelsOri.filter((lb) => labelFocus.indexOf(lb) === -1),
      ];

      setLabels(allLabels);
    }
  }, [labelsOri, labelFocus]);

  if (!isExist(labelsOri)) {
    return <Loader />;
  }

  const onExpand = () => setIsExpand(true);
  const onClose = () => setIsExpand(false);

  return (
    <ListTag
      isManageable={isManageable}
      labels={labels}
      labelFocus={labelFocus}
      onTagClick={onLabelFocus}
      onClear={onClear}
      isExpand={isExpand}
      onExpand={onExpand}
      onClose={onClose}
    />
  );
};

export default Tags;
