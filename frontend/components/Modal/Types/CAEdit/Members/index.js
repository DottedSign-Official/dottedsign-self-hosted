import { WrapperItems, Item } from "./styled";

const CaMembers = ({ members, handleCheckMember }) => {
  const LIMIT_MEMBER = 10;

  if (!members.length) {
    return null;
  }

  return (
    <WrapperItems>
      {members.slice(0, LIMIT_MEMBER).map((member, index) => (
        <Item key={index}>{member}</Item>
      ))}
      {members.length > LIMIT_MEMBER && (
        <Item isCursor onClick={handleCheckMember}>
          ...
        </Item>
      )}
    </WrapperItems>
  );
};

export default CaMembers;
