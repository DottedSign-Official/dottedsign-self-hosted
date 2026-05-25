import React from "react";
import Button from "../Button";
import Icon from "../Icon";

export const TYPE = {
  LIST: "list",
  GIRD: "grid",
};

const ModeSwitch = ({ mode, setMode }) => (
  <>
    {mode !== TYPE.LIST && (
      <Button
        id="TaskMode-List"
        type="icon"
        handleEvent={() => setMode(TYPE.LIST)}
        btnStyle={{ marginRight: "24px" }}
      >
        <Icon type="modeList" />
      </Button>
    )}

    {mode !== TYPE.GIRD && (
      <Button
        id="TaskMode-Card"
        type="icon"
        handleEvent={() => setMode(TYPE.GIRD)}
        btnStyle={{ marginRight: "24px" }}
      >
        <Icon type="modeThumbnail" />
      </Button>
    )}
  </>
);

export default ModeSwitch;
