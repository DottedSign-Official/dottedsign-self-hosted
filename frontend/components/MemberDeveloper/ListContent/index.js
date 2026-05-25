import { useTranslation } from "react-i18next";

import MoreActions from "../../../containers/MoreActions";
import { ListItem, Col } from "../../../global/styledAdmin";

const ListContent = ({ members, onModifyMemberStatus }) => {
  const { t } = useTranslation("developer");

  const getActionIcon = (status) =>
    status === "active" ? "archive" : "unarchive";
  const getActionName = (status) =>
    status === "active" ? t("freeze_account") : t("activate_account");

  return (
    <>
      {members.map((member) => (
        <ListItem key={member.id}>
          <Col len="40%" align="left">
            {member.email}
          </Col>
          <Col len="40%" align="left">
            {member?.group?.name}
          </Col>
          <Col len="10%" align="left">
            {t(member.status)}
          </Col>
          <Col len="10%" align="right">
            <MoreActions
              actions={[
                {
                  iconType: getActionIcon(member.status),
                  iconSize: "16px",
                  name: getActionName(member.status),
                  func: () => {
                    onModifyMemberStatus(member);
                  },
                },
              ]}
            />
          </Col>
        </ListItem>
      ))}
    </>
  );
};

export default ListContent;
