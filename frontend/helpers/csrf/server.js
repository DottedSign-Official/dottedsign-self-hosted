const csurf = require("csurf");

const getCSRFMiddleware = () => {
  return csurf({
    cookie: {
      expires: new Date(Date.now() + 60000 * 1000),
      maxAge: 60000,
    },
  });
};

module.exports = getCSRFMiddleware;
