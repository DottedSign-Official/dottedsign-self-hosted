import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import { Col } from "../../global/styledAdmin";
import { IconWrapper, ColumnMenuWrapper, ColumnMenuItem } from "./styled";
import Icon from "../Icon";

const ColumnWithMenu = ({
  t,
  len,
  isTitle,
  children,
  menus = [],
  onMenuItemClick,
  defaultMenuItem,
  hideSelectedResult = false,
  offset = { top: "90%", left: "0%" },
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuName, setSelectedMenuName] = useState("");

  useEffect(() => {
    if (defaultMenuItem?.name) {
      setSelectedMenuName(defaultMenuItem.name);
    }
  }, [defaultMenuItem]);

  const handleToggleMenu = () => {
    if (menus.length > 0) {
      setIsMenuOpen((prevState) => !prevState);
    }
  };

  const handleMenuClick = (event, menu) => {
    event.stopPropagation();
    setSelectedMenuName(menu.name);
    setIsMenuOpen(false);
    if (onMenuItemClick) {
      onMenuItemClick(menu);
    }
  };

  const timerRef = useRef(null);

  const handleBlur = () => {
    if (menus.length > 0) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsMenuOpen(false);
      }, 100);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const FilterMenu = () => {
    if (menus.length === 0) {
      return null;
    }

    return (
      <>
        <IconWrapper>
          <Icon type="chevDown" size="18px" />
        </IconWrapper>
        {isMenuOpen && (
          <ColumnMenuWrapper top={offset.top} left={offset.left}>
            {menus.map((menu) => (
              <ColumnMenuItem
                key={`filter-menu-${menu.id}`}
                onClick={(event) => handleMenuClick(event, menu)}
                isActive={selectedMenuName === menu.name}
              >
                {t(menu.name)}
              </ColumnMenuItem>
            ))}
          </ColumnMenuWrapper>
        )}
      </>
    );
  };

  return (
    <Col
      len={len}
      tabIndex={5566}
      isTitle={isTitle}
      onBlur={handleBlur}
      onClick={handleToggleMenu}
    >
      {hideSelectedResult || selectedMenuName === ""
        ? children
        : t(selectedMenuName)}
      <FilterMenu />
    </Col>
  );
};

ColumnWithMenu.propTypes = {
  t: PropTypes.func.isRequired,
  len: PropTypes.string.isRequired,
  isTitle: PropTypes.bool,
  children: PropTypes.node,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  onMenuItemClick: PropTypes.func,
  hideSelectedResult: PropTypes.bool,
  offset: PropTypes.shape({
    top: PropTypes.string,
    left: PropTypes.string,
  }),
  defaultMenuItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

export default ColumnWithMenu;
