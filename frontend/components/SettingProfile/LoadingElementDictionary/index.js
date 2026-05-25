import {
  LabelSub,
  ContentBlockSub,
  ItemLabel,
  ItemDesc,
} from "../../../global/styledSettings";
import { FIELD_TYPE } from "../data";
import { WrapperProfile, WrapperItem } from "../styled";
import Loader from "../../Loaders/Label";
import { ContentBlock } from "../../../global/styledSettings";

const LoadingElementDictionary = {
  [FIELD_TYPE.CONTENT_BLOCK]: ({ children }) => (
    <ContentBlock>
      <Loader />
      <WrapperProfile>{children}</WrapperProfile>
    </ContentBlock>
  ),
  [FIELD_TYPE.CONTENT_BLOCK_SUB]: ({ children }) => (
    <ContentBlockSub>
      <LabelSub>
        <Loader />
      </LabelSub>
      {children}
    </ContentBlockSub>
  ),
  [FIELD_TYPE.INPUT]: () => (
    <WrapperItem>
      <ItemLabel>
        <Loader />
      </ItemLabel>
      <ItemDesc>
        <Loader />
      </ItemDesc>
    </WrapperItem>
  ),
};

export default LoadingElementDictionary;
