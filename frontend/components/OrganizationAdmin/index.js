import React from "react";
import { useTranslation } from "next-i18next";
import Btn from "../Button";
import {
  Block,
  Label,
  BlockContent,
  Items,
  Item,
  ItemLabel,
  ItemContent,
} from "../../global/styledAdmin";

import { CompanyAvatar, AdminList, AdminInfo } from "./styled";

const OrganizationAdmin = ({
  isEditable,
  admin,
  logo,
  organization,
  onModifyClick,
}) => {
  const { t } = useTranslation("admin");

  return (
    <Block width="50%">
      <Label>{t("label_organization_details")}</Label>
      <BlockContent>
        {organization && admin && (
          <>
            <Items>
              <Item>
                <ItemLabel>{t("administrator")}</ItemLabel>
                <ItemContent>
                  <AdminList>
                    {admin.map(({ name, email }, index) => (
                      <AdminInfo key={index}>{`${name} (${email})`}</AdminInfo>
                    ))}
                  </AdminList>
                </ItemContent>
              </Item>
              <Item>
                <ItemLabel>{t("company_name")}</ItemLabel>
                <ItemContent>{organization.name}</ItemContent>
              </Item>
              <Item>
                <ItemLabel>{t("company_logo")}</ItemLabel>
                <ItemContent>
                  {logo?.preview ? (
                    <CompanyAvatar src={logo.preview} alt="company-logo" />
                  ) : (
                    t("empty")
                  )}
                </ItemContent>
              </Item>
            </Items>

            {isEditable && (
              <Btn type="adminPositive" handleEvent={onModifyClick}>
                {t("manage_company_info")}
              </Btn>
            )}
          </>
        )}
      </BlockContent>
    </Block>
  );
};

export default OrganizationAdmin;
