import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Container, WrapperInput } from "./styled";

const VerificationCodeInput = ({
  autoFocus = false,
  inputProps,
  length = 6,
  onChange = () => null,
  onCompleted = () => null,
  placeholder = "",
  type = "number",
  value: defaultValue = "",
}) => {
  const fillValues = (value) =>
    new Array(length).fill("").map((_, index) => value[index] ?? "");

  const [values, setValues] = useState(fillValues(defaultValue));
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputsRefs = useMemo(
    () => new Array(length).fill(null).map(() => createRef()),
    [length],
  );

  const validate = (input) => {
    if (type === "number") {
      return /^\d/.test(input);
    }

    if (type === "alphanumeric") {
      return /^[a-zA-Z0-9]/.test(input);
    }

    return true;
  };

  const selectInputContent = (index) => {
    const input = inputsRefs[index].current;

    if (input) {
      requestAnimationFrame(() => {
        input.select();
      });
    }
  };

  const setValue = (value, index) => {
    const nextValues = [...values];
    nextValues[index] = value;

    setValues(nextValues);

    const stringifiedValues = nextValues.join("");
    const isCompleted = stringifiedValues.length === length + 1;

    if (isCompleted) {
      onCompleted(stringifiedValues);
      return;
    }

    onChange(stringifiedValues);
  };

  const focusInput = useCallback(
    (index) => {
      const input = inputsRefs[index]?.current;

      if (input) {
        requestAnimationFrame(() => {
          input.focus();
        });
      }
    },
    [inputsRefs],
  );

  const blurInput = (index) => {
    const input = inputsRefs[index]?.current;

    if (input) {
      requestAnimationFrame(() => {
        input.blur();
      });
    }
  };

  const onInputFocus = (index) => {
    const input = inputsRefs[index]?.current;

    if (input) {
      setFocusedIndex(index);
      selectInputContent(index);
    }
  };

  const onInputChange = (event, index) => {
    const eventValue = event.target.value;

    const value = eventValue.replace(values[index], "");

    if (!validate(value)) {
      selectInputContent(index);
      return;
    }

    if (value.length > 1) {
      setValues(fillValues(eventValue));

      const isCompleted = eventValue.length === length;

      if (isCompleted) {
        onCompleted(eventValue);
        blurInput(index);
        return;
      }

      return;
    }

    setValue(value, index);

    if (index === length - 1) {
      blurInput(index);
      return;
    }

    focusInput(index + 1);
  };

  const onInputKeyDown = (event, index) => {
    const eventKey = event.key;

    if (eventKey === "Backspace" || eventKey === "Delete") {
      event.preventDefault();

      setValue("", focusedIndex);
      focusInput(index - 1);

      return;
    }

    if (eventKey === values[index]) {
      focusInput(index + 1);
    }
  };

  const onInputPaste = (event, index) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData("text");
    const nextValues = pastedValue.slice(0, length);

    if (!validate(nextValues)) {
      return;
    }

    setValues(fillValues(nextValues));
    onChange(nextValues);

    const isCompleted = nextValues.length === length;

    if (isCompleted) {
      onCompleted(nextValues);
      blurInput(index);
      return;
    }

    focusInput(nextValues.length);
  };

  useEffect(() => {
    if (autoFocus) {
      focusInput(0);
    }
  }, [autoFocus, focusInput, inputsRefs]);

  return (
    <Container>
      {inputsRefs.map((ref, i) => (
        <WrapperInput
          type="tel"
          autoComplete="one-time-code"
          key={i}
          onChange={(event) => onInputChange(event, i)}
          onFocus={() => onInputFocus(i)}
          onKeyDown={(event) => onInputKeyDown(event, i)}
          onPaste={(event) => onInputPaste(event, i)}
          placeholder={placeholder}
          ref={ref}
          value={values[i]}
          {...inputProps}
        />
      ))}
    </Container>
  );
};

export default VerificationCodeInput;
