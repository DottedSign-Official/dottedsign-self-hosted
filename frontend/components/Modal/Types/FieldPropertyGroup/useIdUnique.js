import { useSelector } from "react-redux";

const useIdUnique = (itemsLocal = [], groupLocal = {}) => {
  const { stages, fieldGroups } = useSelector((state) => state.create);

  const signer = itemsLocal[0]?.assigne;

  const isIdInStages = (id) => {
    return stages.some(
      (stage) => stage.id === id || stage.field_group_object_id === id,
    );
  };

  const isIdUnique = (id, currentFieldIndex = -1) => {
    // NOTE: check against groupLocal
    if (groupLocal?.field_group_object_id === id) {
      return false;
    }

    // NOTE: check against itemsLocal
    const isIdInCurrentAssigne = stages
      .filter((stage) => stage.assigne?.uid === signer?.uid)
      .some((item, index) => index !== currentFieldIndex && item.id === id);
    if (isIdInCurrentAssigne) {
      return false;
    }

    // NOTE: check against stages
    return !isIdInStages(id);
  };

  const isGroupIdUnique = (id) => {
    const isIdInFieldGroups = fieldGroups.some(
      (item) => item.field_group_object_id === id,
    );

    if (isIdInFieldGroups) {
      return false;
    }

    return !isIdInStages(id);
  };

  return { isIdUnique, isGroupIdUnique };
};

export default useIdUnique;
