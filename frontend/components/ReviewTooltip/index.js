import { useTranslation } from "next-i18next";
import { Content } from "./styled";
import { hintTexts } from "./data";

const ReviewTooltip = ({ type, position = "bottom-left" }) => {
  const { t } = useTranslation("common");

  return <Content position={position}>{t(hintTexts[type])}</Content>;
};

export default ReviewTooltip;
