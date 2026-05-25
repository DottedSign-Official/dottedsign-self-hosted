import { enUS, de, es, fr, it, ja, ko, zhCN, zhTW, th } from "date-fns/locale";
import { useTranslation } from "next-i18next";

const localeMap = {
  en: enUS,
  de,
  es,
  fr,
  it,
  ja,
  ko,
  "zh-cn": zhCN,
  "zh-tw": zhTW,
  th,
};

const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const currentLocale = localeMap[language] || enUS;

  return { currentLocale };
};

export default useDateFnsLocale;
