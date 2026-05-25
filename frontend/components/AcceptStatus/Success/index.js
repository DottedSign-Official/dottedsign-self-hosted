import { ACCEPT_STATUS } from "../../../constants/constants";
import Cover from "../../../components/Cover";
import Btn from "../../../components/Button";
import { useTranslation } from "next-i18next";

const Success = ({ redirect }) => {
  const { t } = useTranslation("common");

  return (
    <Cover isVisible type={ACCEPT_STATUS.acceptSuc}>
      <Btn type="primary" handleEvent={redirect}>
        {t("error_btn")}
      </Btn>
    </Cover>
  );
};

export default Success;
