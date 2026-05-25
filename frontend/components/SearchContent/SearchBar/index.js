import React from "react";
import { useTranslation } from "next-i18next";
import SearchInput from "./Input";
import SearchType from "./Type";
import SearchFilter from "./Filter";
import SelectLabels from "../../../containers/SelectLabels";
import { Wrapper, WrapperInner, WrapperSearch, Btn } from "./styled";

const SearchBar = ({ myLabels, isDeveloper, onSearch, setConditions }) => {
  const { t } = useTranslation("common");

  const onLabelChange = (operation, tag) => {
    const itms = myLabels;
    const itm = tag;

    const updatedItms =
      operation === "add"
        ? [...(itms || []), itm]
        : operation === "delete"
        ? itms.filter((t) => t !== itm)
        : itms;

    setConditions({ labels: updatedItms });
    onSearch({ labels: updatedItms });
  };

  return (
    <Wrapper>
      <WrapperInner>
        <WrapperSearch>
          <SearchInput onSearch={onSearch} />
          <SearchType type={isDeveloper ? "developer" : "tasks"} />
          <Btn onClick={() => onSearch()}>{t("btn_search")}</Btn>
        </WrapperSearch>
        {!isDeveloper && <SearchFilter onSearch={onSearch} />}
        {!isDeveloper && (
          <SelectLabels
            optionsActive={myLabels}
            onUpdate={onLabelChange}
            target={"search"}
          />
        )}
      </WrapperInner>
    </Wrapper>
  );
};

export default SearchBar;
