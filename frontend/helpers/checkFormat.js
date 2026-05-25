export const checkEmailValid = (email) => {
  const rule =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email.match(rule);
};

export const checkPwdValid = (pwd) => {
  if (pwd.length > 7) {
    return true;
  }
  return false;
};
