import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTemplate as setTemplateAction } from "../../redux/actions/template";
import onBlur from "../../helpers/onBlur";
import TooltipE from "../TooltipExtend";
import Icon from "../Icon";
import More from "./More";
import { WrapperItem, Preview, Name, TemplateCode, ShareIcon } from "./styled";

const Item = ({ isManageable, template }) => {
  const timerRef = useRef();
  const blurRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const { templatesCount, templatesShareCount, templateFocus } = useSelector(
    (state) => state.template,
  );
  const dispatch = useDispatch();
  const setTemplate = (data) => dispatch(setTemplateAction(data));

  useEffect(() => {
    const timer = timerRef;
    const blur = blurRef;
    return () => {
      clearTimeout(timer.current);
      clearTimeout(blur.current);
    };
  }, []);

  const onFocus = () => {
    // NOTE: halt when applying template
    if (!isManageable && template.over_limit) {
      return null;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTemplate(template);
    }, 100);
  };

  const onLoseFocus = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => {
      if (document.activeElement.id === "template-blur-prevent-default") {
        return null;
      }
      setTemplate(null);
    })(e);
  };

  const isFocus =
    templateFocus && templateFocus.template_id === template.template_id;

  const isSharable = user && user.group_id;
  const isShared = template.share_info && template.share_info.share_by_others;
  const isSharing = template.share_info && template.share_info.share_by_me;

  const getMenuStatus = () => {
    if (isShared) {
      return "shared";
    }

    if (isSharing) {
      return "sharing";
    }

    if (isSharable) {
      return "sharable";
    }

    return "default";
  };

  if (templatesCount === null || templatesShareCount === null) {
    return null;
  }

  return (
    <WrapperItem
      tabIndex={56}
      isFocus={isFocus}
      onClick={onFocus}
      onBlur={onLoseFocus}
    >
      <Preview>
        {template.thumbnail ? (
          <img src={template.thumbnail} alt="template-thumbnail" />
        ) : (
          <div />
        )}
      </Preview>

      <Name>
        <TooltipE text={template.file_name} position="upward" isCenter isBold />
      </Name>

      <TemplateCode>{template?.code}</TemplateCode>

      {(isShared || isSharing) && (
        <ShareIcon isShared={isShared}>
          <Icon type="changeSigner" size="16px" />
        </ShareIcon>
      )}

      {isManageable && isFocus && (
        <More
          id={template.template_id}
          name={template.file_name}
          templateCode={template?.code}
          tags={template.tags || []}
          menuStatus={getMenuStatus()}
        />
      )}
    </WrapperItem>
  );
};

export default Item;
