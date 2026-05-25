import React from "react";

import Sign from "./Sign";
import Info from "./Info";
import Finish from "./Finish";
import Rollback from "./Rollback";
import Review from "./Review";
import ReviewPassed from "./ReviewPassed";

const NavbarActions = ({ download, signSteps, taskInfo, rollback, review }) => {
  return (
    <>
      {download.isVisible && <Finish data={download.data} />}
      {signSteps.isVisible && <Sign data={signSteps.data} />}
      {taskInfo.isVisible && <Info data={taskInfo.data} />}
      {rollback.isVisible && <Rollback data={rollback.data} />}
      {review.isVisible && <Review />}
      {review.isPassed && <ReviewPassed />}
    </>
  );
};

export default NavbarActions;
