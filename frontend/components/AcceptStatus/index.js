import { ACCEPT_STATUS } from "../../constants/constants";
import Success from "./Success";
import Register from "./Register";
import Error from "./Error";

const Comps = {
  [ACCEPT_STATUS.acceptSuc]: Success,
  [ACCEPT_STATUS.needRegisterFirst]: Register,
};

const AcceptStatus = (props) => {
  const Comp = Comps[props.status];
  return (
    <>
      {Comp && <Comp {...props} />}
      {!Comp && <Error {...props} />}
    </>
  );
};

export default AcceptStatus;
