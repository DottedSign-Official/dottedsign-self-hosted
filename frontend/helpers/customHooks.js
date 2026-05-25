import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { isEmail } from "./utility";

export const useEventListener = (eventName, handler, element) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) {
      return;
    }
    if (!savedHandler.current) {
      return;
    }

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export const useEffectAsync = (asyncCallback, deps) => {
  useEffect(() => {
    (async () => {
      await asyncCallback();
    })();
  }, deps);
};

export const useInterval = (callback, delay) => {
  const id = useRef(null);
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      id.current = setInterval(tick, delay);
      return () => clearInterval(id.current);
    }
  }, [delay, id]);
};

export const cancellablePromise = (promise) => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) =>
        isCanceled ? reject({ isCanceled, value }) : resolve({ value }),
      (error) => reject({ isCanceled, error }),
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => (isCanceled = true),
  };
};

// NOTE: Common validations
export const useCommonValidators = () => {
  const { t } = useTranslation("validations");

  const requiredValidator = useCallback(
    (newValue) => {
      if (typeof newValue === "number") {
        return null;
      }
      if (!newValue) {
        return t("required");
      }
      return null;
    },
    [t],
  );

  const emailValidator = (newValue) => {
    if (isEmail(newValue)) {
      return null;
    }
    return t("should_be_an_email");
  };

  const passwordValidator = (newValue) => {
    if (newValue.length > 7) {
      return null;
    }
    return t("invalid_password");
  };

  const trimValidator = useCallback(
    (newValue) => {
      if (newValue !== newValue.trim()) {
        return t("should_not_have_whitespace");
      }
      return null;
    },
    [t],
  );

  const maxLengthValidator = (length) => (newValue) => {
    if (newValue.length < length) {
      return null;
    }
    return t("exceed_length_limit");
  };

  return {
    requiredValidator,
    emailValidator,
    passwordValidator,
    trimValidator,
    maxLengthValidator,
  };
};

const runValidateOf = (field, formState, fieldValidators) => {
  const fieldValue = formState[field];
  let validators = fieldValidators[field];
  if (!Array.isArray(validators)) {
    validators = [validators];
  }
  const errorTexts = validators
    .map((validator) => {
      if (typeof validator === "function") {
        return validator(fieldValue, formState);
      }
      return null;
    })
    .filter((text) => text);

  return errorTexts.length === 0 ? null : errorTexts.join(", ");
};

const buildDefaultFormErrors = (fields) => {
  const defaultState = {};
  fields.forEach((field) => {
    defaultState[field] = null;
  });
  return defaultState;
};

const isFormValid = (formErrors) =>
  Object.values(formErrors).every((error) => error === null);

export const useFormValidations = (fieldValidators, resetObserved = null) => {
  const [formErrors, setFormErrors] = useState(() => {
    return buildDefaultFormErrors(Object.keys(fieldValidators));
  });

  const validate = (formState, field) => {
    setFormErrors((formErrors) => ({
      ...formErrors,
      [field]: runValidateOf(field, formState, fieldValidators),
    }));
    const newErrors = {
      ...formErrors,
      [field]: runValidateOf(field, formState, fieldValidators),
    };
    return isFormValid(newErrors);
  };

  const validateAll = useCallback(
    (formState) => {
      const newErrors = {};
      Object.keys(fieldValidators).forEach((field) => {
        newErrors[field] = runValidateOf(field, formState, fieldValidators);
      });
      setFormErrors(newErrors);
      return isFormValid(newErrors);
    },
    [fieldValidators],
  );

  // NOTE: Reset formErrors to default when resetObserved object changed.
  useEffect(() => {
    if (resetObserved) {
      setFormErrors(buildDefaultFormErrors(Object.keys(fieldValidators)));
    }
  }, [resetObserved, fieldValidators]);

  return {
    formErrors,
    setFormErrors,
    validate,
    validateAll,
    isFormValid: isFormValid(formErrors),
  };
};

export const useWithInDiv = (div) => {
  const [isWithInDiv, setIsWithInDiv] = useState(false);
  const divRef = useRef(div || null);

  const pointerEnterMenu = () => {
    setIsWithInDiv(true);
  };

  const pointerLeaveMenu = () => {
    setIsWithInDiv(false);
  };

  const registerEventListener = useCallback((menuElement) => {
    menuElement.addEventListener("pointerenter", pointerEnterMenu);
    menuElement.addEventListener("pointerleave", pointerLeaveMenu);
  }, []);

  const unregisterEventListener = useCallback((menuElement) => {
    menuElement.removeEventListener("pointerenter", pointerEnterMenu);
    menuElement.removeEventListener("pointerleave", pointerLeaveMenu);
  }, []);

  useEffect(() => {
    if (divRef.current) {
      registerEventListener(divRef.current);
    }

    const div = divRef.current;
    return () => {
      if (div) {
        unregisterEventListener(div);
      }
    };
  }, [registerEventListener, unregisterEventListener]);

  return { divRef, isWithInDiv };
};

export const useSigningGroups = () => {
  const [isCreatable] = useState(true);
  const [isEditable] = useState(true);
  const { signingGroupTotalAmount } = useSelector((state) => state.settings);

  return {
    isCreatable,
    isEditable,
    amount: signingGroupTotalAmount,
    limit: 999, // TODO: magic num
  };
};

export const useCheckWindowIdleHook = () => {
  const [isIdle, setIdle] = useState(true);

  useEffect(() => {
    const setActive = () => setIdle(false);
    const setIsIdle = () => setIdle(true);

    const activeEvents = ["touchstart", "mousedown"];
    const idleEvents = ["touchend", "mouseup"];

    activeEvents.forEach((event) => window.addEventListener(event, setActive));
    idleEvents.forEach((event) => window.addEventListener(event, setIsIdle));

    return () => {
      activeEvents.forEach((event) =>
        window.removeEventListener(event, setActive),
      );
      idleEvents.forEach((event) =>
        window.removeEventListener(event, setIsIdle),
      );
    };
  }, []);

  return isIdle;
};

export const usePinchZoom = (elementRef) => {
  const [refreshScale, setRefreshScale] = useState(1);
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    const attachPinchZoomEvents = (element, setScale, onBlur) => {
      const { onMove, onEnd, onStart } = (() => {
        let baseScale = 1;
        let currentScale = 1;
        let baseScrollLeft = 0;
        let baseScrollTop = 0;
        let scrollLeftOffsetUnit = 0;
        let scrollTopOffsetUnit = 0;

        const onMove = (scale) => {
          currentScale = Math.max(baseScale * scale, 1.0);
          setScale(currentScale);

          element.scrollTo(
            baseScrollLeft + (currentScale - baseScale) * scrollLeftOffsetUnit,
            baseScrollTop + (currentScale - baseScale) * scrollTopOffsetUnit,
          );
        };

        const onEnd = () => {
          baseScale = currentScale;
          onBlur(currentScale);
        };

        const onStart = (anchorX, anchorY) => {
          baseScrollLeft = element.scrollLeft;
          baseScrollTop = element.scrollTop;

          scrollLeftOffsetUnit =
            ((anchorX / 100) * element.scrollWidth) / baseScale;
          scrollTopOffsetUnit =
            ((anchorY / 100) * element.scrollHeight) / baseScale;
        };

        return { onMove, onEnd, onStart };
      })();

      let start = {};

      const distance = (event) => {
        return Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY,
        );
      };

      const calcPercentage = (clientX, clientY) => {
        const width = element.scrollWidth;
        const height = element.scrollHeight;

        const clickX =
          clientX - element.getBoundingClientRect().left + element.scrollLeft;
        const clickY =
          clientY - element.getBoundingClientRect().top + element.scrollTop;

        const percentageX = (clickX / width) * 100;
        const percentageY = (clickY / height) * 100;

        return { x: percentageX, y: percentageY };
      };

      const touchStart = (event) => {
        if (event.touches.length === 2) {
          const { x, y } = calcPercentage(
            (event.touches[0].clientX + event.touches[1].clientX) / 2,
            (event.touches[0].clientY + event.touches[1].clientY) / 2,
          );
          onStart(x, y);

          event.preventDefault();

          start.distance = distance(event);
        }
      };

      const touchMove = (event) => {
        if (event.touches.length === 2) {
          event.preventDefault();

          const deltaDistance = distance(event);
          const scale = deltaDistance / start.distance;
          const truncateScale = scale;

          onMove(truncateScale);
        }
      };

      const nonPassive = { passive: false };
      element.addEventListener("touchstart", touchStart, nonPassive);
      element.addEventListener("touchmove", touchMove, nonPassive);
      element.addEventListener("touchend", onEnd, nonPassive);

      return () => {
        element.removeEventListener("touchstart", touchStart, nonPassive);
        element.removeEventListener("touchmove", touchMove, nonPassive);
        element.removeEventListener("touchend", onEnd, nonPassive);
      };
    };

    const clear = attachPinchZoomEvents(
      elementRef.current,
      setDisplayScale,
      setRefreshScale,
    );
    return clear;
  }, [elementRef]);

  return { refresh: refreshScale, display: displayScale };
};

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === "visible",
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
