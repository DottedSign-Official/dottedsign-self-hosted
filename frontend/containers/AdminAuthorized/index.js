import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Error from "../../components/ErrorAdmin";
import { Block, Label, BlockContent } from "../../global/styledAdmin";
import { pathToPermissionSelector, pathToTitle } from "./data";

const AdminAuthorized = ({ children }) => {
  const { t } = useTranslation("admin");

  const router = useRouter();
  const { pathname } = router;
  const permission = useSelector((state) => state.auth.user.current_permission);

  const permissionSelector = pathToPermissionSelector[pathname];

  if (!permissionSelector) {
    console.error(
      `${pathname} not defined as key of pathToPermissionSelector.`,
    );
    return null;
  }

  if (!permission) {
    return null;
  }

  const isAuthorized = permissionSelector(permission);
  if (!isAuthorized) {
    return (
      <Block width="50%">
        <Label>{t(pathToTitle[pathname])}</Label>
        <BlockContent>
          <Error type="unauthorized" />
        </BlockContent>
      </Block>
    );
  }

  return children;
};

export default AdminAuthorized;
