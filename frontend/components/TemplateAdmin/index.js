import { useTranslation } from "next-i18next";

import LoaderLabel from "../Loaders/Label";
import Loader from "../Loaders/AdminPermissions";
import Pagination from "../Pagination";
import List from "./List";

import { PaginationWrapper } from "./styled";
import { Block, Label, BlockContent } from "../../global/styledAdmin";

const TemplateAdmin = ({
  pages,
  currentPage,
  onPageChange,
  isPlaceholder,
  templateShareList,
  handleTemplateAdminShare,
  handleDeleteTemplateAdminShare,
}) => {
  const { t } = useTranslation("admin");

  const content = () => {
    if (isPlaceholder) {
      return <Loader />;
    }

    return (
      <>
        <List
          t={t}
          items={templateShareList}
          handleTemplateAdminShare={handleTemplateAdminShare}
          handleDeleteTemplateAdminShare={handleDeleteTemplateAdminShare}
        />
        <PaginationWrapper>
          <Pagination
            page={currentPage}
            pages={pages}
            onTabClick={onPageChange}
          />
        </PaginationWrapper>
      </>
    );
  };

  return (
    <Block width="100%">
      {isPlaceholder ? <LoaderLabel /> : <Label>{t("label_templates")}</Label>}
      <BlockContent>{content()}</BlockContent>
    </Block>
  );
};

export default TemplateAdmin;
