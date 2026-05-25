import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openModal as openModalAction } from "../../redux/actions/common";
import {
  getTemplateShareList,
  putTemplateAdminShare,
} from "../../redux/actions/template";
import TemplateAdminComp from "../../components/TemplateAdmin";
import { MODAL_TYPE } from "../../constants/constants";

const TemplateAdmin = () => {
  const { isLoading } = useSelector((state) => state.admin);
  const { currentPage, totalPages, templateShareList } = useSelector(
    (state) => state.template,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTemplateShareList());
  }, [dispatch]);

  const onPageChange = (page) => {
    dispatch(getTemplateShareList({ page }));
  };

  const handleTemplateAdminShare = ({ templateId, filterType }) => {
    const onSubmit = ({ groupIds }) => {
      dispatch(
        putTemplateAdminShare({
          templateId,
          filterType,
          groupIds,
        }),
      );
    };

    dispatch(
      openModalAction({
        modalType: MODAL_TYPE.templateAdminShare,
        modalData: {
          templateId,
          onSubmit,
        },
      }),
    );
  };

  const handleDeleteTemplateAdminShare = ({ templateId, filterType }) => {
    dispatch(
      openModalAction({
        modalType: MODAL_TYPE.deleteTemplateAdminShare,
        modalData: {
          templateId,
          filterType,
        },
      }),
    );
  };

  return (
    <TemplateAdminComp
      pages={totalPages}
      isPlaceholder={isLoading}
      currentPage={currentPage}
      onPageChange={onPageChange}
      templateShareList={templateShareList}
      handleTemplateAdminShare={handleTemplateAdminShare}
      handleDeleteTemplateAdminShare={handleDeleteTemplateAdminShare}
    />
  );
};

export default TemplateAdmin;
