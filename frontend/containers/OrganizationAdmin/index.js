import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { getOrganization } from "../../redux/actions/admin";
import { MODAL_TYPE } from "../../constants/constants";
import LoaderLabel from "../../components/Loaders/Label";
import Loader from "../../components/Loaders/AdminUserList";
import OrganizationAdminComponent from "../../components/OrganizationAdmin";

const OrganizationAdmin = () => {
  const [logo, setLogo] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const org = useSelector((state) => state.admin.organization);
  const { isLoading } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const onModifyClick = () => {
    openModal({ modalType: MODAL_TYPE.organizationModifyAdmin });
  };

  useEffect(() => {
    dispatch(getOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (org) {
      if (org.icon_url) {
        const icon = org.icon_url;
        if (icon) {
          setLogo({ preview: icon });
        }
      }
    }
  }, [org]);

  useEffect(() => {
    if (isLoading) {
      setLogo(null);
    }
  }, [isLoading]);

  const permission = user.current_permission;

  const isEditable =
    permission &&
    (permission.manage_company_logo ||
      permission.manage_company_name ||
      permission.manage_email_display_name);

  if (!user || !org) {
    return (
      <>
        <LoaderLabel />
        <Loader />
      </>
    );
  }

  return (
    <OrganizationAdminComponent
      logo={logo}
      admin={org.admin_infos}
      organization={org}
      isEditable={isEditable}
      onModifyClick={onModifyClick}
    />
  );
};

export default OrganizationAdmin;
