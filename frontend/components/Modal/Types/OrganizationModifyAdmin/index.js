import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { putOrganization as putOrganizationAction } from "../../../../redux/actions/admin";
import { uploadFieldStyle } from "../../../../constants/constants";
import Loader from "../../../Loaders/ModalOrganizationModify";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import Dropzone from "../../../../containers/Dropzone";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Input } from "../../../../global/styledForm";
import { Item, Label, Text, WrapperLogo, Logo, Del } from "./styled";

const OrganizationModifyAdmin = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [admin, setAdmin] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);

  const {
    user: { current_permission },
  } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.admin.isLoading);
  const org = useSelector((state) => state.admin.organization);

  const permission = current_permission;
  const dispatch = useDispatch();
  const putOrganization = (data) => dispatch(putOrganizationAction(data));
  const onCompanyChange = (e) => setCompanyName(e.target.value);

  useEffect(() => {
    if (org) {
      const myAdmin = org.group_members.find((mem) => {
        return mem.roles.find((rol) => rol === "admin") !== null;
      });
      setAdmin(myAdmin);
      setCompanyName(org.name);

      if (org.icon_url) {
        const icon = org.icon_url;

        if (icon) {
          setLogo({ preview: icon });
        }
      }
    }
  }, [org]);

  const onLogoDelete = () => {
    if (logo) {
      setLogo(null);
    }
  };

  const onLogoChange = (files) => {
    setLogo(files[0]);
  };

  const onUpdate = () => {
    putOrganization({
      name: companyName,
      logo,
    });
  };

  if (!org) {
    return <Loader />;
  }

  const ContentLogo = () => {
    if (!permission) {
      return null;
    }

    if (!permission.manage_company_logo) {
      const file = logo && logo.preview;
      return (
        <WrapperLogo>
          {file && <Logo src={file} alt="logo-company" />}
        </WrapperLogo>
      );
    }

    if (logo) {
      return (
        <WrapperLogo>
          <Logo src={logo.preview} alt="logo-preview" />
          <Del onClick={onLogoDelete}>
            <Icon type="cancelBlack" />
          </Del>
        </WrapperLogo>
      );
    }

    return (
      <Dropzone
        type={uploadFieldStyle.textWithBack}
        allowedFormat={"image"}
        setFiles={onLogoChange}
      />
    );
  };

  const isNameEditable = permission && permission.manage_company_name;

  const isBtnEditable =
    permission &&
    (permission.manage_company_name || permission.manage_company_logo);

  return (
    <Wrapper width="650px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_update_organization_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Item>
            <Label>{t("modal_update_organization_label_admin")}</Label>
            <Text>{`${admin.name}  (${admin.email})`}</Text>
          </Item>
          <Item>
            <Label>{t("modal_update_organization_label_name")}</Label>

            {isNameEditable ? (
              <Input
                type="text"
                value={companyName}
                onChange={onCompanyChange}
              />
            ) : (
              <Text>{companyName}</Text>
            )}
          </Item>
          <Item>
            <Label>{t("modal_update_organization_label_logo")}</Label>
            {ContentLogo()}
          </Item>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>

        {isBtnEditable && (
          <>
            <DividerBtn />
            <ButtonWithLoading
              isLoading={isLoading}
              type="primaryFlex"
              handleEvent={onUpdate}
            >
              {t("btn_save")}
            </ButtonWithLoading>
          </>
        )}
      </Panel>
    </Wrapper>
  );
};

export default OrganizationModifyAdmin;
