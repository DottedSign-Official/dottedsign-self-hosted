import { useTranslation } from "next-i18next";
import { useSigningGroups } from "../../helpers/customHooks";
import Btn from "../Button";
import Groups from "./Groups";
import Pagination from "../Pagination";
import Loader from "../Loaders/SigningGroups";
import {
  ContentBlock,
  Label,
  ContentBlockSub,
} from "../../global/styledSettings";
import { Wrapper, WrapperLabel } from "./styled";

const SettingSigningGroup = ({
  isLoading,
  groups,
  pageCurrent,
  pages,
  onPageChanged,
  onCreate,
}) => {
  const { t } = useTranslation("settings");
  const { isCreatable } = useSigningGroups();

  if (isLoading) {
    return (
      <ContentBlock>
        <Label>{t("settings_tab_signing_group")}</Label>

        <ContentBlockSub>
          <Wrapper>
            <WrapperLabel>{t("list")}</WrapperLabel>
          </Wrapper>

          <Loader />
        </ContentBlockSub>
      </ContentBlock>
    );
  }

  return (
    <ContentBlock>
      <Label>{t("settings_tab_signing_group")}</Label>

      <ContentBlockSub>
        <Wrapper>
          <WrapperLabel>{t("list")}</WrapperLabel>

          {isCreatable && (
            <Btn type="settingEdit" handleEvent={onCreate}>
              {t("btn_add_signing_group")}
            </Btn>
          )}
        </Wrapper>

        <Groups groups={groups} />

        <Pagination
          pages={pages}
          page={pageCurrent}
          onTabClick={onPageChanged}
        />
      </ContentBlockSub>
    </ContentBlock>
  );
};

export default SettingSigningGroup;
