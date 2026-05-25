import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMode as setModeAction } from "../../redux/actions/sign";
import ModeSwitchComponent from "../../components/ModeSwitch";

const ModeSwitch = () => {
  const mode = useSelector((state) => state.sign.mode);
  const dispatch = useDispatch();
  const setMode = useCallback(
    (mod) => dispatch(setModeAction(mod)),
    [dispatch],
  );

  useEffect(() => {
    const modeDefault = localStorage.getItem("mode_cache");

    if (
      modeDefault &&
      typeof modeDefault !== "undefined" &&
      (modeDefault === "list" || modeDefault === "grid")
    ) {
      setMode(modeDefault);
    }
  }, [setMode]);

  const onModeSelect = (mod) => {
    localStorage.setItem("mode_cache", mod);
    setMode(mod);
  };

  return <ModeSwitchComponent mode={mode} setMode={onModeSelect} />;
};

export default ModeSwitch;
