import React from "react";
import Checkbox from "../../../../Checkbox";
import UserStage from "../../../../UserStage";
import { Wrapper, Menu, Item, User, StageID } from "./styled";

const SignerList = ({ stages, targetStage, onTargetConfirm }) => {
  return (
    <Wrapper id="modal-body-scrollable">
      <Menu>
        {stages.map((stage, idx) => (
          <Item key={idx} isSelectable={stage.isSelectable}>
            <Checkbox
              isRadio
              isChecked={stage === targetStage}
              onToggle={() => onTargetConfirm(stage)}
              isReadOnly={!stage.isSelectable}
            />
            <User>
              <UserStage stage={stage} />
            </User>
            <StageID>{stage.stageId}</StageID>
          </Item>
        ))}
      </Menu>
    </Wrapper>
  );
};

export default SignerList;
