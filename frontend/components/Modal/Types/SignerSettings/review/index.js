import { useTranslation } from "next-i18next";
import ListAssignes from "../../../../../containers/ListAssignes";
import Icon from "../../../../Icon";
import { Block, Label, Hint } from "../styled";

const Review = ({ isTemplate, reviewers, setReviewers, myObj, isOrder }) => {
  const { t } = useTranslation("modal");

  const onUpdate = ({ newItems }) => {
    const newReviewers = newItems.map((item) => ({
      ...item,
      actor_info: { base_uid: myObj.uid },
    }));
    setReviewers(newReviewers);
  };

  return (
    <Block>
      <Label>{t("reviewers")}</Label>
      <Hint>
        <Icon type="tips" />
        <p>{t("reviewers_hint")}</p>
      </Hint>
      <ListAssignes
        isTemplate={isTemplate}
        isOrder={isOrder}
        isModal
        isNullable
        assignes={reviewers}
        setAssignes={onUpdate}
        warnings={{}}
        position="review"
      />
    </Block>
  );
};

export default Review;
