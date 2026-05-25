import React from "react";
import { useSelector } from "react-redux";

import tips from "../../constants/tips";

import PublicForms from "../PublicForms";
import Tips from "../../components/Tips";
import PublicFormTasks from "../PublicFormTasks";
import { WrapperContent, Content } from "../../global/styledSettings";

const MyPublicForms = () => {
  return (
    <>
      <Tips type={tips.publicForms} />
      <Content>
        <PublicForms />
      </Content>
    </>
  );
};

const MyPublicFormTasks = ({ focus }) => {
  return <PublicFormTasks focus={focus} />;
};

const PublicFormMain = () => {
  const { tabActive } = useSelector((state) => state.publicForm);
  const isMyPublicFormsActive = tabActive === "my_public_forms";
  const isPublicFormTasksActive =
    tabActive === "waiting_for_me" ||
    tabActive === "waiting_for_others" ||
    tabActive === "completed" ||
    tabActive === "canceled" ||
    tabActive === "reissue_for_me";

  return (
    <WrapperContent>
      {isMyPublicFormsActive && <MyPublicForms />}
      {isPublicFormTasksActive && <MyPublicFormTasks focus={tabActive} />}
    </WrapperContent>
  );
};

export default PublicFormMain;
