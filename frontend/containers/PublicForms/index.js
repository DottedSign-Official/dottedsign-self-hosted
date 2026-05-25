import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPublicFormAll as getPublicFormAllAction,
  setPublicFormCurrentPage as setPublicFormCurrentPageAction,
} from "../../redux/actions/publicForm";
import Loader from "../../components/Loaders/ProtectedTask";
import Component from "../../components/PublicForms";
import { PUBLIC_FORM_PER_PAGE } from "../../constants/constants";

const Container = () => {
  const {
    isLoading,
    publicFormAll,
    publicFormCurrentPage,
    publicFormTotalPages,
  } = useSelector((state) => state.publicForm);
  const dispatch = useDispatch();
  const getPublicFormAll = (data) => dispatch(getPublicFormAllAction(data));
  const setPublicFormCurrentPage = (data) =>
    dispatch(setPublicFormCurrentPageAction(data));

  useEffect(() => {
    getPublicFormAll({
      page: publicFormCurrentPage || 1,
      per_page: PUBLIC_FORM_PER_PAGE,
    });
  }, [publicFormCurrentPage]);

  if (!publicFormAll) {
    return <Loader />;
  }

  return (
    <Component
      isLoading={isLoading}
      list={publicFormAll || []}
      currentPage={publicFormCurrentPage}
      allPages={publicFormTotalPages}
      setCurrentPage={setPublicFormCurrentPage}
    />
  );
};

export default Container;
