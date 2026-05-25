import { VERIFY_STATUS } from "../../constants/constants";

const data = {
  [VERIFY_STATUS.noToken]: {
    icon: "/static/icons/verify_fal.png",
    title: "verify_notoken_title",
    desc: "verify_notoken_desc",
  },

  [VERIFY_STATUS.verifyInprocess]: {
    title: "verify_inprocess_title",
    desc: "verify_inprocess_desc",
  },

  [VERIFY_STATUS.verifySuc]: {
    icon: "/static/icons/verify_suc.png",
    title: "verify_succ_title",
    desc: "verify_succ_desc",
  },

  [VERIFY_STATUS.verifyFal]: {
    icon: "/static/icons/verify_fal.png",
    title: "verify_fail_title",
    desc: "verify_fail_desc",
  },
};
export default data;
