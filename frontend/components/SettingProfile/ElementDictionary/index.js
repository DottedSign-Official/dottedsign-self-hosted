import Input from "../Input";
import {
  LabelSub,
  ContentBlockSub,
  ItemLabel,
  ItemDesc,
} from "../../../global/styledSettings";
import { FIELD_TYPE } from "../data";
import { WrapperProfile, WrapperItem } from "../styled";
import { ContentBlock, Label } from "../../../global/styledSettings";
import { forwardRef } from "react";

const Block = ({ title, children }) => (
  <ContentBlock>
    <Label>{title}</Label>
    <WrapperProfile>{children}</WrapperProfile>
  </ContentBlock>
);

const SubBlock = ({ title, children }) => (
  <ContentBlockSub>
    <LabelSub>{title}</LabelSub>
    {children}
  </ContentBlockSub>
);

const InputField = (
  { onEnter, title, placeholder, value, isEdit, callback },
  ref,
) => (
  <WrapperItem>
    <ItemLabel>{title}</ItemLabel>
    {!isEdit && <ItemDesc>{value}</ItemDesc>}
    {isEdit && (
      <Input
        callback={callback}
        value={value}
        placeholder={placeholder}
        ref={ref}
        onEnter={onEnter}
      />
    )}
  </WrapperItem>
);

const ElementDictionary = {
  [FIELD_TYPE.CONTENT_BLOCK]: Block,
  [FIELD_TYPE.CONTENT_BLOCK_SUB]: SubBlock,
  [FIELD_TYPE.INPUT]: forwardRef(InputField),
};

export default ElementDictionary;
