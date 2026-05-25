import { Panel, Choice } from "./styled";

const ReviewPanel = ({ corner, onCheck, onReturn, onLinkClick }) => (
  <Panel corner={corner} onClick={onLinkClick}>
    <Choice variant="pass" onClick={onCheck}>
      Pass
    </Choice>
    <Choice variant="fail" onClick={onReturn}>
      Fail
    </Choice>
  </Panel>
);

export default ReviewPanel;
