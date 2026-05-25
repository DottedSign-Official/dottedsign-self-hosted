import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Btn from "../../../Button";
import { WrapperSub, WrapperItem } from "../../styled";

const ActionRollback = ({ data }) => {
  const { myInfo } = data;
  const { t } = useTranslation("common");
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const { code } = router.query;

  const onRollback = () => {
    const { stage_id, task_id } = myInfo;
    if (code && user.isFake) {
      router.push({
        pathname: "/reissue",
        query: { code },
      });
    } else if (stage_id && task_id) {
      router.push({
        pathname: "/reissue",
        query: { stage_id, task_id },
      });
    }
  };

  return (
    <WrapperSub>
      <WrapperItem>
        <Btn type="primaryFlex" handleEvent={onRollback}>
          {t("task_rollback")}
        </Btn>
      </WrapperItem>
    </WrapperSub>
  );
};

export default ActionRollback;
