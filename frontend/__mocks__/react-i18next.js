const i18n = jest.createMockFromModule("react-i18next");

i18n.useTranslation = () => {
  return {
    t: (t) => t,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

module.exports = i18n;
