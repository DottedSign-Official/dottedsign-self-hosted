import { useSelector, useDispatch } from "react-redux";
import { openModal as openModalAction } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";
import EditUploadDocument from "../../components/EditUploadDocument";

const EditUploadDocumentContainer = ({ isViewOnly }) => {
  const { files } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));

  const onEdit = () => {
    const payload = {
      modalType: MODAL_TYPE.editTemplateDocuments,
      modalData: null,
    };
    openModal(payload);
  };

  return (
    <EditUploadDocument isViewOnly={isViewOnly} files={files} onEdit={onEdit} />
  );
};

export default EditUploadDocumentContainer;
