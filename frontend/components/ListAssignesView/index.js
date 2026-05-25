import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { filterSignerAssignes } from "../../helpers/assignees/review";
import { isFormSigner } from "../../helpers/assignees/publicForm";
import TagNumber from "../TagNumber";
import { Recipients, Recipient, Name } from "./styled";

const ListAssignesView = ({ isTemplate, assignes, isMini }) => {
  const { t } = useTranslation("publicForm");
  const filteredAssignes = useMemo(
    () => filterSignerAssignes(assignes),
    [assignes],
  );

  if (filteredAssignes.length < 1) {
    return null;
  }

  return (
    <Recipients>
      {filteredAssignes.map((assigne, idx) => (
        <Recipient key={idx}>
          <TagNumber indx={assigne.key} />
          <Name>
            {isTemplate
              ? `${assigne.role}`
              : isMini
              ? `${assigne.name}`
              : `${isFormSigner(assigne) ? assigne.role : assigne.name} (${
                  isFormSigner(assigne) ? t("form_signer") : assigne.email
                })`}
          </Name>
        </Recipient>
      ))}
    </Recipients>
  );
};

export default ListAssignesView;
