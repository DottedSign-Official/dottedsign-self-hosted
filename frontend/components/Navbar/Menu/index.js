import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../../redux/actions/common";
import { MODAL_TYPE } from "../../../constants/constants";
import tooltip from "../../../constants/tooltip";
import Tooltip from "../../../containers/Tooltip";
import AvatarCollapse from "../../../containers/AvatarCollapse";
import Button from "../../Button";
import Attachment from "./Attachment";

import { WrapperSub, WrapperItem, DotNotify } from "../styled";

const NavbarMenu = ({ menu: { message, redirect }, isGuestSign }) => {
  const Router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const { isMyTurn, isSigningDone } = useSelector((state) => state.sign);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const onMessage = () => {
    if (message.data.isModifying) {
      openModal({
        modalType: MODAL_TYPE.checkerMsg,
        modalData: {
          msg: message.data.message,
          isReviewing: message.data.isReviewingAgain,
        },
      });
      return;
    }

    openModal({ modalType: MODAL_TYPE.senderMessage, modalData: message.data });
  };

  const onBack = () => {
    const shouldHint = isMyTurn && !isSigningDone;
    const redirectLink = isGuestSign ? "/" : redirect.link;

    if (shouldHint) {
      openModal({
        modalType: MODAL_TYPE.taskOnBackHint,
        modalData: { redirectLink },
      });
      return;
    }

    Router.push(redirectLink);
  };

  const tipType = message.data.isModifying
    ? tooltip.returnMessage
    : tooltip.message;

  return (
    <WrapperSub>
      <Attachment />

      {message.isVisible && (
        <WrapperItem>
          <Button type="icon" handleEvent={onMessage}>
            <DotNotify />
            <Tooltip type={tipType} />
          </Button>
        </WrapperItem>
      )}

      {redirect.isVisible && (
        <WrapperItem>
          <Button type="icon" handleEvent={onBack}>
            <Tooltip type={tooltip.backTask} position="bottomRight" />
          </Button>
        </WrapperItem>
      )}

      {user && !user.isFake && (
        <WrapperItem isDesktopOnly>
          <AvatarCollapse isAlignRight />
        </WrapperItem>
      )}
    </WrapperSub>
  );
};

export default NavbarMenu;
