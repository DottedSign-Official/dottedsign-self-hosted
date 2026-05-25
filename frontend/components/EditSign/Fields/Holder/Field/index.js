import { useTranslation } from "next-i18next";
import { ReactSVG } from "react-svg";
import SignComponent from "../../../../Sign";
import { WrapperRequired, Block } from "../styled";
import Placeholder, { PLACEHOLDER_COLOR } from "../../../../Placeholder";
import {
  PDF_VIEWPORT_SCALE,
  ALIGNMENT_TYPE,
  fieldTypes,
} from "../../../../../constants/constants";
import Icon from "../../../../Icon";
import { DefaultText, CheckboxValue, RadioValue } from "./styled";

const DefaultValue = ({ t, createdObj, scale }) => {
  const placeholder = (() => {
    const defaultPlaceholder = (() => {
      return t(createdObj.text);
    })();

    return createdObj.options?.placeholder || defaultPlaceholder;
  })();

  if (createdObj.type === fieldTypes.checkbox && createdObj.style === 0) {
    if (createdObj.options?.default) {
      return (
        <DefaultText>
          <CheckboxValue>
            <ReactSVG src="../../../../static/icons/ic-checked.svg" />
          </CheckboxValue>
        </DefaultText>
      );
    }
  }

  if (
    (createdObj.type === fieldTypes.checkbox && createdObj.style === 1) ||
    createdObj.type === fieldTypes.radio
  ) {
    if (createdObj.options?.default) {
      return (
        <DefaultText>
          <RadioValue />
        </DefaultText>
      );
    }
  }

  if (createdObj.type === fieldTypes.image) {
    const content = placeholder;
    const fontSize = `${14 * scale}px`;
    return <DefaultText fontSize={fontSize}>{content}</DefaultText>;
  }

  if (createdObj.type === fieldTypes.link) {
    const fontSize = `${(createdObj.options?.font_size || 14) * scale}px`;

    const content = createdObj.options?.default || placeholder;

    return (
      <DefaultText
        fontSize={fontSize}
        isDate={createdObj.is_date}
        isValued={createdObj.options?.default}
        alignment={"left"}
      >
        {content}
      </DefaultText>
    );
  }

  return (
    <Placeholder
      fontSize={createdObj?.options?.font_size}
      maxWidth={14}
      alignment={createdObj?.options?.alignment}
      color={
        createdObj?.options?.default
          ? PLACEHOLDER_COLOR.TEXT
          : PLACEHOLDER_COLOR.HINT
      }
      text={
        createdObj?.options?.default ||
        createdObj?.options?.placeholder ||
        t(createdObj.text)
      }
      lineWrap={createdObj?.options?.is_multi_line}
      autoExpand={createdObj?.options?.read_only}
      verticalAlignment={
        createdObj?.options?.is_multi_line ||
        createdObj?.options?.vertical_alignment === "start"
          ? ALIGNMENT_TYPE.START
          : ALIGNMENT_TYPE.CENTER
      }
    />
  );
};

const Field = ({
  isInsertable,
  createdObj,
  orderObj,
  isRequiredBorder,
  viewport,
}) => {
  const { t } = useTranslation("create");

  const valueContent = (() => {
    if (!viewport) {
      return null;
    }

    if (isInsertable && createdObj.raw) {
      return (
        <SignComponent
          scaler={PDF_VIEWPORT_SCALE}
          wrapperStyle={{ width: "100%", height: "100%", opacity: "1" }}
          {...createdObj}
          isSignAndSend
        />
      );
    }
    return (
      <DefaultValue t={t} createdObj={createdObj} scale={viewport.scale} />
    );
  })();

  return (
    <>
      {createdObj &&
        createdObj.options &&
        createdObj.options.force &&
        !createdObj.options.read_only &&
        !isInsertable && (
          <WrapperRequired>
            <Icon src={"/static/icons/ic-asterisk.svg"} />
          </WrapperRequired>
        )}

      <Block
        indx={orderObj}
        isRadio={
          (createdObj.type === "checkbox" && createdObj.style === 1) ||
          createdObj.type === "radio"
        }
        readOnly={createdObj.options.read_only}
        isRequiredBorder={isRequiredBorder}
      >
        {valueContent}
      </Block>
    </>
  );
};

export default Field;
