import { Block } from "../styled";
import Placeholder from "./Placeholder";
import Default from "./Default";
import TextLength from "../Properties/TextLength";
import Font from "../Properties/Font";
import Validation from "../Properties/Validation";
import { useCallback, useEffect, useMemo } from "react";
import { getTextFiledValidator } from "../../../../../helpers/sign";
import { creditCardFormatter } from "../../../../../helpers/sign";
import { VALIDATION_TYPE } from "../../../../../constants/constants";

const TextField = ({ onUpdate, options, t }) => {
  const {
    alignment,
    alignment_fixed,
    placeholder,
    font_size,
    font_size_fixed,
    length,
    validation,
    validation_regex,
    is_multi_line,
  } = options;
  const defaultValue = options.default;
  const { validator } = useMemo(
    () =>
      getTextFiledValidator({
        length,
        validation,
        validation_regex,
      }),
    [length, validation, validation_regex],
  );

  const onUpdateKeys = useCallback(
    (props) => {
      onUpdate((prev) => ({ ...prev, ...props }));
    },
    [onUpdate],
  );

  useEffect(() => {
    const isValid = validator(defaultValue);
    if (!isValid) {
      onUpdateKeys({ default: "" });
    }
  }, [validator, defaultValue, onUpdateKeys]);

  return (
    <>
      <Block>
        <Placeholder
          t={t}
          onChange={(value) => onUpdateKeys({ placeholder: value })}
          placeholder={placeholder}
          isMultiLine={is_multi_line}
        />
      </Block>

      <Block>
        <Default
          t={t}
          onChange={(value) => onUpdateKeys({ default: value })}
          value={defaultValue}
          isMultiLine={is_multi_line}
          onChangeFormatter={
            validation === VALIDATION_TYPE.CREDIT_CARD
              ? creditCardFormatter
              : (value) => value
          }
        />
      </Block>

      <Block>
        <TextLength
          t={t}
          onChange={(value) => onUpdateKeys({ length: value })}
          length={length}
        />
      </Block>

      <Block>
        <Font
          t={t}
          onChange={onUpdateKeys}
          font_size={font_size}
          font_size_fixed={font_size_fixed}
          alignment={alignment}
          alignment_fixed={alignment_fixed}
        />
      </Block>

      <Block>
        <Validation
          t={t}
          onChange={onUpdateKeys}
          validation={validation}
          validation_regex={validation_regex}
        />
      </Block>
    </>
  );
};

export default TextField;
