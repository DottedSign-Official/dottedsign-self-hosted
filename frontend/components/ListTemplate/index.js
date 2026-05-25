import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { isExist } from "../../helpers/others";
import WindowWidth from "../../containers/WindowWidth";
import Loader from "../Loaders/Template";
import Blank from "../Blank";
import Item from "./Item";
import { Wrapper, WrapperCreate, Text } from "./styled";

const ListTemplate = ({
  isLoading,
  isManageable,
  isPlaceholder,
  templates,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const onCreate = () => {
    if (typeof window !== "undefined") {
      router.push("/template/prepare-doc");
    }
  };

  if (!isExist(templates) || isLoading) {
    return (
      <Wrapper>
        {[...Array(4)].map((_, idx) => (
          <Loader key={idx} />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {templates &&
        templates.map((template) => (
          <Item
            key={template.template_id}
            isManageable={isManageable}
            template={template}
          />
        ))}

      {isManageable && (
        <WrapperCreate onClick={onCreate}>
          <Text>{t("btn_create")}</Text>
        </WrapperCreate>
      )}

      {templates && templates.length < 1 && isPlaceholder && (
        <Blank type={"template"} />
      )}
    </Wrapper>
  );
};

export default WindowWidth(ListTemplate);
