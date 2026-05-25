import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as signActions from "../../redux/actions/sign";
import onBlur from "../../helpers/onBlur";
import MyStamps from "../../components/MyStamps";
import { useTranslation } from "next-i18next";

const MyStampsContainer = ({ onSelect, isSigning }) => {
  const { t } = useTranslation("settings");
  const blurRef = useRef();
  const [myStamps, setMyStamps] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const isLoading = useSelector((state) => state.sign.isLoading);
  const mySigns = useSelector((state) => state.sign.stamps);
  const dispatch = useDispatch();
  const saveSignature = (data) => dispatch(signActions.saveSign(data));
  const deleteSignature = (data) => dispatch(signActions.deleteSign(data));
  const createStampSign = (data) => dispatch(signActions.createStampSign(data));

  useEffect(() => {
    if (!mySigns) {
      dispatch(signActions.getSigns({ category: "stamp" }));
    }
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, [mySigns, dispatch]);

  useEffect(() => {
    if (mySigns) {
      const stamps = mySigns.filter((sign) => sign.category === "stamp");
      setMyStamps(stamps);
    }
  }, [mySigns]);

  const onSignSave = (files) => {
    const fileObj = files[0];

    saveSignature({
      file_type: "png",
      raw: fileObj.raw,
      file: { size: fileObj.file.size },
      category: "stamp",
    });
  };

  const onSignDelete = (id) => {
    deleteSignature({ id });
  };

  const onSignSelect = (stamp) => {
    setActiveItem(stamp);

    if (onSelect) {
      onSelect(stamp);
    }
  };

  const onSignBlur = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setActiveItem(null))(e);
  };

  return (
    <MyStamps
      isLoading={isLoading}
      isSigning={isSigning}
      myStamps={myStamps}
      activeItem={activeItem}
      onSignSave={onSignSave}
      onSignDelete={onSignDelete}
      onSignSelect={onSignSelect}
      onSignBlur={onSignBlur}
      onCreateStamp={createStampSign}
      t={t}
    />
  );
};

export default MyStampsContainer;
