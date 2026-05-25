import { useEffect } from "react";
import { useRouter } from "next/router";
import { i18n } from "next-i18next";
import { languages } from "../../constants/languages";
import { isExist } from "../../helpers/others";
import { useSelector } from "react-redux";

const LangLoader = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      return;
    }

    const { pathname, asPath, query } = router;
    const lng = i18n?.language?.toLowerCase() || "en";

    const lngUsr = user.language?.toLowerCase();
    const lngObj = languages.find((tag) => tag.id === lngUsr);

    if (isExist(lngObj) && lngUsr !== lng) {
      router.push({ pathname, query }, asPath, { locale: lngUsr });
    }
  }, [router, user]);

  return null;
};

export default LangLoader;
