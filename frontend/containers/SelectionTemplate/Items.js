import React from "react";
import { useSelector } from "react-redux";
import ListTemplate from "../../components/ListTemplate";

const Template = ({ isPlaceholder, isManageable }) => {
  const { isLoading, templates } = useSelector((state) => state.template);

  return (
    <ListTemplate
      isLoading={isLoading}
      isManageable={isManageable}
      isPlaceholder={isPlaceholder}
      templates={templates}
    />
  );
};

export default Template;
