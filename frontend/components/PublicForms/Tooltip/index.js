import { Wrapper, Name } from "./styled";

const TemplateTooltip = ({ name }) => {
  return (
    <Wrapper title={name}>
      <Name>{name}</Name>
    </Wrapper>
  );
};

export default TemplateTooltip;
