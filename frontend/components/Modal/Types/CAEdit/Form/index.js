import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import CaMembers from "../Members";
import CAEditFormLoader from "../../../../Loaders/CAEditForm";
import {
  WrapperEle,
  Label,
  Input,
  WrapperError,
  Error,
  DeleteButton,
  CheckButton,
} from "../../../../../global/styledForm";

const CAEditForm = ({
  formErrors,
  formState,
  handleNameChange,
  handleClusterIdChange,
  handleEmailChange,
  handleTokenChange,
  handleCheckMember,
  handleDelete,
}) => {
  const { t } = useTranslation(["admin", "modal"]);
  const { systemCADetail, isLoading } = useSelector((state) => state.admin);

  if (isLoading || !systemCADetail || !formState) {
    return <CAEditFormLoader />;
  }

  const { name, clusterId, email, token, members } = formState;
  return (
    <>
      <WrapperEle>
        <Label>{t("ca_name")}</Label>
        <Input
          name="name"
          value={name}
          onChange={handleNameChange}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        {formErrors.name && (
          <WrapperError>
            <Error>{formErrors.name}</Error>
          </WrapperError>
        )}
      </WrapperEle>
      <WrapperEle>
        <Label>Cluster Id</Label>
        <Input
          name="clusterId"
          value={clusterId}
          onChange={handleClusterIdChange}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        {formErrors.clusterId && (
          <WrapperError>
            <Error>{formErrors.clusterId}</Error>
          </WrapperError>
        )}
      </WrapperEle>
      <WrapperEle>
        <Label>{t("email")}</Label>
        <Input
          name="email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        {formErrors.email && (
          <WrapperError>
            <Error>{formErrors.email}</Error>
          </WrapperError>
        )}
      </WrapperEle>
      <WrapperEle>
        <Label>Token</Label>
        <Input
          name="token"
          value={token}
          onChange={handleTokenChange}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        {formErrors.token && (
          <WrapperError>
            <Error>{formErrors.token}</Error>
          </WrapperError>
        )}
      </WrapperEle>
      <WrapperEle>
        <Label>{`${t("menu_ca")}${t("member")}`}</Label>
        <CaMembers members={members} handleCheckMember={handleCheckMember} />
        <CheckButton
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleCheckMember();
          }}
        >
          {members.length > 0
            ? t("btn_edit", { ns: "common" })
            : t("btn_add", { ns: "modal" })}
        </CheckButton>
      </WrapperEle>
      <WrapperEle>
        <Label>{`${t("delete", { ns: "common" })}${t("menu_ca")}`}</Label>
        <DeleteButton
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          {t("delete", { ns: "common" })}
        </DeleteButton>
      </WrapperEle>
    </>
  );
};

export default CAEditForm;
