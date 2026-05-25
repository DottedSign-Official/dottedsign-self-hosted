import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAssigneFocus as setAssigneFocusAction } from "../../redux/actions/create";
import { filterSignerAssignes } from "../../helpers/assignees/review";
import { onBlurWithDelay as onBlurEvent } from "../../helpers/onBlur";
import SelectAssignes from "../../components/SelectAssignes";

const SelectAssignesContainer = ({
  isLocal,
  assigneFocusLocal,
  setAssigneFocusLocal,
}) => {
  const blurRef = useRef();
  const [isCollapse, setIsCollapse] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  const assignes = useSelector((state) => state.create.assignes);
  const assigneFocus = useSelector((state) => state.create.assigneFocus);
  const dispatch = useDispatch();
  const setAssigneFocus = useCallback(
    (itm) => dispatch(setAssigneFocusAction(itm)),
    [dispatch],
  );

  const filteredAssignes = useMemo(
    () => filterSignerAssignes(assignes),
    [assignes],
  );

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  useEffect(() => {
    if (filteredAssignes && !assigneFocusLocal) {
      if (isLocal) {
        setAssigneFocusLocal(filteredAssignes[0]);
      } else {
        setAssigneFocus(filteredAssignes[0]);
      }
    }
  }, [
    filteredAssignes,
    assigneFocusLocal,
    isLocal,
    setAssigneFocusLocal,
    setAssigneFocus,
  ]);

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onBlur = (e) => {
    clearTimeout(blurRef.current);
    onBlurEvent(blurRef, () => {
      setIsFocus(false);
      setIsCollapse(true);
    })(e);
  };

  const onSelect = (item) => {
    if (isLocal) {
      setAssigneFocusLocal(item);
    } else {
      setAssigneFocus(item);
    }
    setIsCollapse(true);
  };

  const myFocus = isLocal ? assigneFocusLocal : assigneFocus;

  if (!filteredAssignes || !myFocus) {
    return null;
  }

  return (
    <SelectAssignes
      isCollapse={isCollapse}
      isFocus={isFocus}
      assignes={filteredAssignes}
      assigneFocus={myFocus}
      onToggle={onToggle}
      onSelect={onSelect}
      onBlur={onBlur}
    />
  );
};

export default SelectAssignesContainer;
