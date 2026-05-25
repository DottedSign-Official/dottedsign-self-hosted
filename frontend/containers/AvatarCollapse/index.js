import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getOrganization } from "../../redux/actions/admin";
import { openModal as openModalAction } from "../../redux/actions/common";
import { onBlurWithDelay as onBlur } from "../../helpers/onBlur";
import AvatarCollapse from "../../components/AvatarCollapse";
import { MODAL_TYPE } from "../../constants/constants";

const AvatarCollapseContainer = ({ isAlignRight }) => {
  const Router = useRouter();

  const blurRef = useRef();
  const [isCollapse, setIsCollapse] = useState(true);
  const { user, features } = useSelector((state) => state.auth);
  const { organization } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  useEffect(() => {
    if (!organization) {
      dispatch(getOrganization());
    }
  }, [organization, dispatch]);

  const onBlurEvent = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setIsCollapse(true))(e);
  };

  const onToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onCreateGroup = () => {
    openModal({
      modalType: MODAL_TYPE.groupCreate,
    });
  };

  const adminItem = ((user) => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!user || !user.confirmed) {
      return null;
    }
    if (!features?.group_enable) {
      return null;
    }
    if (!user.group_id && features?.group_enable) {
      return {
        event: () => onCreateGroup(),
        text: "btn_create_group",
      };
    }
    if (organization) {
      return Router.pathname.indexOf("/admin/") === -1
        ? {
            event: () => Router.push("/admin/overview"),
            text: "btn_to_admin",
          }
        : {
            event: () => Router.push("/tasks"),
            text: "btn_back",
          };
    }
    return null;
  })(user);

  const developerItem = (() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!features || !features.developer_console) {
      return null;
    }

    return Router.pathname.indexOf("/developer/") === -1
      ? {
          event: () => Router.push("/developer/tasks"),
          text: "btn_to_developer",
        }
      : {
          event: () => Router.push("/tasks"),
          text: "btn_back",
        };
  })();

  if (!user) {
    return null;
  }

  return (
    <AvatarCollapse
      isAlignRight={isAlignRight}
      isCollapse={isCollapse}
      user={user}
      adminItem={adminItem}
      devItem={developerItem}
      onBlurEvent={onBlurEvent}
      onToggle={onToggle}
    />
  );
};

export default AvatarCollapseContainer;
