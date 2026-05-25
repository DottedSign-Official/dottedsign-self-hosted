import React from "react";
import { useSelector } from "react-redux";
import SwitchFile from "../../components/SwitchFile";

const SwitchFileContainer = ({
  setEnvelopeName,
  envelopeName,
  isInAssignFieldsPhase,
  isInSigningPhase,
}) => {
  const { totalPage } = useSelector((state) => state.pdf);

  if (!totalPage || totalPage < 1) {
    return null;
  }

  return (
    <SwitchFile
      setEnvelopeName={setEnvelopeName}
      envelopeName={envelopeName}
      isInAssignFieldsPhase={isInAssignFieldsPhase}
      isInSigningPhase={isInSigningPhase}
    />
  );
};

export default SwitchFileContainer;
