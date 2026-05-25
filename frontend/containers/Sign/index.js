import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { coord2Styles } from "../../helpers/coord2Styles";
import { orderColor, readOnlyColor } from "../../global/styled";
import SignComponent from "../../components/Sign";
import { fieldTypes } from "../../constants/constants";
import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

const SignElement = ({
  page,
  order,
  isEditable,
  fileType,
  raw,
  coords,
  id,
  type,
  img,
  value,
  style,
  isDate,
  options,
  setSignature,
  isHide,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const dispatch = useDispatch();
  const onMore = (() => {
    if (!isEditable) {
      return null;
    }
    if (!options) {
      return null;
    }
    if (options.read_only) {
      return null;
    }
    if (type === fieldTypes.text) {
      if (options.font_size_fixed && options.alignment_fixed) {
        return null;
      }

      const onSend = (customOptions) => {
        const updateObj = {
          category: fieldTypes.text,
          raw: raw || null,
        };
        setSignature(updateObj, customOptions);
      };

      const onMore = () => {
        dispatch(
          openModal({
            modalType: MODAL_TYPE.fieldPropertySigner,
            modalData: {
              options: {
                alignment: options?.alignment,
                alignmentFixed: options?.alignment_fixed,
                fontSize: options?.font_size,
                fontSizeFixed: options?.font_size_fixed,
              },
              onSend,
            },
          }),
        );
      };

      return onMore;
    }

    return null;
  })();

  const vp = useSelector((state) => state.pdf.viewport);
  const viewport = vp[page - 1];

  // NOTE: [l, b, r, t]
  const styles = coord2Styles(coords, viewport);

  return (
    <SignComponent
      id={`signInput-${id}`}
      wrapperStyle={{
        ...styles,
        opacity: isHide ? 0 : 1,
      }}
      scaler={1}
      isEditable={isEditable}
      isFocus={isFocus}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      isDate={isDate}
      style={style}
      back={options.read_only ? readOnlyColor : orderColor[order % 8]}
      border={options.read_only ? readOnlyColor : orderColor[order % 8]}
      type={type}
      img={img}
      value={value}
      fileType={fileType}
      raw={raw}
      idDate={`date-${id}`}
      options={options}
      onMore={onMore}
      setSignature={setSignature}
      isRequired={options?.force}
    />
  );
};

export default SignElement;
