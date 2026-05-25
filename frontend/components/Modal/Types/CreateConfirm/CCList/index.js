import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCCInfos as setCCInfosAction } from "../../../../../redux/actions/create";
import ListAssignes from "../../../../../containers/ListAssignes";
import TagNumber from "../../../../TagNumber";
import { Input } from "../../../../../global/styledForm";
import { WrapperList, ColTagNumber, ColName, ColEmail } from "./styled";

const CCList = ({ isInfoFix, ccInfos }) => {
  const dispatch = useDispatch();
  const setCCInfos = (data) => dispatch(setCCInfosAction(data));
  const [list, setList] = useState([]);

  const onUpdate = ({ newItems }) => {
    const newCCInfos = newItems.map((item, idx) => ({
      name: item.name,
      email: item.email,
      key: idx,
    }));
    setList(newCCInfos);
    setCCInfos(newCCInfos);
  };

  useEffect(() => {
    if (ccInfos) {
      const newCCInfos = ccInfos.map((cc, idx) => ({ ...cc, key: idx }));
      setList(newCCInfos);
    }
  }, [ccInfos]);

  return (
    <>
      {isInfoFix &&
        ccInfos.length > 0 &&
        list.map((cc, idx) => (
          <WrapperList key={idx}>
            <ColTagNumber>
              <TagNumber />
            </ColTagNumber>

            <ColName>
              <Input type="text" name="name" defaultValue={cc.name} disabled />
            </ColName>

            <ColEmail>
              <Input
                type="text"
                name="email"
                defaultValue={cc.email}
                disabled
              />
            </ColEmail>
          </WrapperList>
        ))}

      {!isInfoFix && (
        <ListAssignes
          assignes={list}
          setAssignes={onUpdate}
          warnings={{}}
          position={"cc"}
          isModal
        />
      )}
    </>
  );
};

export default CCList;
