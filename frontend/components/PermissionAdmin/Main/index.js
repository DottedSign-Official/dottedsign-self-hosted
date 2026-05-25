import React from "react";
import { useTranslation } from "next-i18next";
import tooltip from "../../../constants/tooltip";
import Tooltip from "../../../containers/Tooltip";
import ColContent from "../ColContent";
import SubContent from "../SubContent";
import { Wrapper, SectionTitle, SectionContent, Row, Col } from "./styled";

const Permissions = ({
  focus,
  isEdit,
  hiddenKeyList,
  permissions,
  onUpdate,
  onInterLock,
  data,
  roleDefault,
  roleCustom,
}) => {
  const { t } = useTranslation("admin");
  const roleKey = Object.keys(roleDefault).includes(focus) ? focus : roleCustom;

  return (
    <Wrapper>
      {data.map((section) => (
        <React.Fragment key={section.key}>
          <SectionTitle>{t(section.title)}</SectionTitle>
          <SectionContent>
            {section.rows.map((row) => {
              const isShow =
                hiddenKeyList.includes(row.key) || !row.isShow.includes(roleKey)
                  ? false
                  : true;

              const isFixed = row.isFixed.indexOf(roleKey) > -1;

              return (
                <Row key={row.key}>
                  <Col>
                    <ColContent
                      isShow={isShow}
                      isFixed={isFixed}
                      isEdit={isEdit}
                      links={row.links}
                      keyRow={row.key}
                      value={permissions[row.key]}
                      onUpdate={onUpdate}
                      onInterLock={onInterLock}
                    />
                  </Col>

                  <Col isLabel>
                    {t(row.text)}
                    {row.tooltip && <Tooltip type={tooltip[row.tooltip]} />}
                  </Col>

                  {isShow && row.secondLayer && (
                    <SubContent
                      isFixed={isFixed}
                      isEdit={isEdit}
                      role={roleKey}
                      keyMain={row.key}
                      sections={row.secondLayer}
                      permissions={permissions}
                      onUpdate={onUpdate}
                    />
                  )}
                </Row>
              );
            })}
          </SectionContent>
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default Permissions;
