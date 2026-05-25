import { useState } from "react";
import Icon from "../../Icon";
import { Wrapper, Menu, MenuItem } from "./styled";

const More = ({ items }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const onItemClick = (data) => {
    return (e) => {
      e.stopPropagation();
      data.callback();
      setIsCollapse(true);
    };
  };

  const onToggle = (e) => {
    e.stopPropagation();
    setIsCollapse((prev) => !prev);
  };

  return (
    <>
      <Wrapper tabIndex={0} onClick={onToggle}>
        <Icon type="more" />
        <Menu>
          {!isCollapse &&
            items.map((data, index) => {
              return (
                <MenuItem key={index} onClick={onItemClick(data)}>
                  {data.text}
                </MenuItem>
              );
            })}
        </Menu>
      </Wrapper>
    </>
  );
};
export default More;
