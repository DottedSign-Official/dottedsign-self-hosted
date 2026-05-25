import React from "react";
import FileList from "../../containers/FileList";
import InputSwitch from "../../containers/InputSwitch";
import { WrapperFiles, EnvelopeTitle, Default } from "./styled";

const SwitchFile = ({
  setEnvelopeName,
  envelopeName,
  isInAssignFieldsPhase,
  isInSigningPhase,
}) => {
  return (
    <>
      <EnvelopeTitle>
        {isInSigningPhase && <Default>{envelopeName}</Default>}

        {isInAssignFieldsPhase && (
          <InputSwitch
            value={envelopeName}
            onSubmit={setEnvelopeName}
            isBlankProhibit
          />
        )}
      </EnvelopeTitle>
      <WrapperFiles>
        <FileList
          isInSigningPhase={isInSigningPhase}
          isInAssignFieldsPhase={isInAssignFieldsPhase}
        />
      </WrapperFiles>
    </>
  );
};

export default SwitchFile;
