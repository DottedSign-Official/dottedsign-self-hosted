import React from "react";
import Main from "./main";
import Timezone from "./timezone";

const keySignature = "signature_timestamp";
const keyTimezone = "time_zone";

const SettingPreferenceSig = ({ isEdit, preference, onUpdate }) => {
  const onUpdateMain = (val) => {
    onUpdate({
      [keySignature]: val,
      [keyTimezone]: "Asia/Taipei",
    });
  };

  const onUpdateTimezone = (val) => {
    onUpdate({ [keyTimezone]: val });
  };

  if (!preference) {
    return null;
  }

  return (
    <>
      <Main
        value={preference[keySignature]}
        onUpdate={onUpdateMain}
        isReadOnly={!isEdit}
      />

      {preference[keySignature] === true && (
        <Timezone
          value={preference[keyTimezone]}
          onUpdate={onUpdateTimezone}
          isReadOnly={!isEdit}
        />
      )}
    </>
  );
};

export default SettingPreferenceSig;
