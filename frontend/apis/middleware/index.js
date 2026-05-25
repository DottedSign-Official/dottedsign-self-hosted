import * as adminMiddleware from "./admin";
import * as signMiddleware from "./sign";

const middleware = {
  ...adminMiddleware,
  ...signMiddleware,
};

export default middleware;
