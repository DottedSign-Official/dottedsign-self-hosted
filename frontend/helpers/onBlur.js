const onBlur = (ref, todo, e, delay) => {
  const currentTarget = e.currentTarget;
  const activeElement = document.activeElement;

  setTimeout(() => {
    if (!currentTarget.contains(activeElement)) {
      if (todo) {
        ref.current = setTimeout(() => {
          todo();
        }, 0);
      }
    }
  }, delay);
};

export const onBlurPlain = (ref, todo) => (e) => {
  onBlur(ref, todo, e, 0);
};

export const onBlurWithDelay = (ref, todo) => (e) => {
  onBlur(ref, todo, e, 100);
};

export default onBlurPlain;
