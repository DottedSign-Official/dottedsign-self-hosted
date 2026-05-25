import React from "react";
import { useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../../../../../redux/actions/common";
import { uploadFieldStyle } from "../../../../../../constants/constants";
import toastType from "../../../../../../constants/toast";
import { orderBy } from "../../../../../../helpers/others";
import Dropzone from "../../../../../../containers/Dropzone";
import Icon from "../../../../../Icon";
import ListReference from "../../../../../ListReference";
import { Wrapper, Item, Name, WrapperDel, WrapperUpload } from "./styled";

const Reference = ({ isReadOnly, references, onChanged }) => {
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));

  const onUploadFiles = (files) => {
    const newFiles = files.map((file) => {
      return {
        file: file.file,
        fileId: file.fileId,
      };
    });

    const refsNew = newFiles;
    const refs = references || [];

    // NOTE: over limit
    if (refsNew.length + refs.length > 10) {
      openToast({ payload: toastType.overLimitReference });
      return;
    }

    // NOTE: change order of new refs
    const refsOri = refsNew.map((ref) => ({ ...ref, name: ref.file.name }));
    const refsRes = orderBy({
      list: [...refsOri],
      key: "name",
      direction: "asc",
    });
    const refsMan = refsRes.map((ref) => {
      const { name, ...res } = ref;
      if (name) {
        return res;
      }
    });
    const refsAll = [...refs, ...refsMan];

    onChanged(refsAll);
  };

  const onDelete = (file) => {
    const referencesFiltered = references.filter(
      (ref) => ref.fileId !== file.fileId,
    );

    onChanged(referencesFiltered);
  };

  if (isReadOnly) {
    return (
      <Wrapper>
        <ListReference references={references} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {references &&
        references.map((ref, idx) => (
          <Item key={idx}>
            <Icon type="menuDownload" />
            <Name>{ref.file.name}</Name>
            <WrapperDel onClick={() => onDelete(ref)}>
              <Icon type="cancel" />
            </WrapperDel>
          </Item>
        ))}
      <WrapperUpload>
        <Dropzone
          type={uploadFieldStyle.textOnly}
          allowedFormat="all"
          setFiles={onUploadFiles}
          isMulti
        />
      </WrapperUpload>
    </Wrapper>
  );
};

export default Reference;
