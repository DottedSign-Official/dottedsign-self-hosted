import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

import {
  getLabels,
  createLabel,
  putLabel,
  delLabel,
  resetLabels,
} from "../../redux/actions/label";

import LabelList from "../../components/LabelList";

const LabelListContainer = () => {
  const dispatch = useDispatch();
  const labels = useSelector((state) => state.label.labels) || [];
  const [searchValue, setSearchValue] = useState("");

  const handleAddLabel = () => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.label,
        modalData: {
          onSubmit: (value) => dispatch(createLabel(value)),
          label: "",
        },
      }),
    );
  };

  const handleEditLabel = (label) => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.label,
        modalData: {
          onSubmit: (value) =>
            dispatch(putLabel({ newLabel: value, oldLabel: label })),
          label,
        },
      }),
    );
  };

  const handleRemoveLabel = (label) => {
    dispatch(
      openModal({
        modalType: MODAL_TYPE.labelDeleteConfirm,
        modalData: {
          onConfirm: () => dispatch(delLabel(label)),
        },
      }),
    );
  };

  const handleKeywordSearch = (value) => {
    setSearchValue(value);

    const params = {
      sort_by: "alphabetical",
      search_name: typeof value === "undefined" ? "" : value,
    };

    dispatch(getLabels(params));
  };

  useEffect(() => {
    dispatch(getLabels());
    return () => {
      dispatch(resetLabels());
    };
  }, [dispatch]);

  return (
    <LabelList
      labels={labels}
      handleAddLabel={handleAddLabel}
      handleEditLabel={handleEditLabel}
      handleRemoveLabel={handleRemoveLabel}
      handleKeywordSearch={handleKeywordSearch}
      searchValue={searchValue}
    />
  );
};

export default LabelListContainer;
