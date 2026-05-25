import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCountries } from "../../../redux/actions/common";
import Icon from "../../../components/Icon";
import {
  Wrapper,
  Active,
  ActiveItm,
  WrapperIcon,
  Menu,
  MenuItem,
  Flag,
  Name,
} from "./styled";

const CountryCode = ({ countryCode, setCountryCode, isReadOnly }) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const [candidates, setCandidates] = useState(null);

  const { countries } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!countries) {
      dispatch(getCountries());
    }
  }, [countries, dispatch]);

  useEffect(() => {
    if (countries) {
      setCandidates(countries);
    }
  }, [countries]);

  const active = (() => {
    if (!candidates) {
      return null;
    }

    return (
      candidates.find((cand) => cand.calling_code === countryCode) ||
      candidates[0]
    );
  })();

  const onClick = () => {
    if (isReadOnly) {
      return;
    }
    setIsCollapse(false);
  };

  const onSelect = (itm) => {
    if (isReadOnly) {
      return;
    }
    setCountryCode(itm.calling_code);
    setIsCollapse(true);
  };

  const onBlur = () => {
    setIsCollapse(true);
  };

  return (
    <Wrapper onBlur={onBlur} tabIndex={56}>
      <Active onClick={onClick}>
        <ActiveItm
          value={`${active?.emoji} +${active?.calling_code}`}
          isDisabled={isReadOnly}
          readOnly
        />
        <WrapperIcon>
          <Icon type="chevDown" size="16px" />
        </WrapperIcon>
      </Active>

      {countries && !isCollapse && (
        <Menu>
          {candidates.map((cand, idx) => (
            <MenuItem key={idx} onClick={() => onSelect(cand)}>
              <Flag>{cand.emoji}</Flag>
              <Name>
                {cand.name}
                &nbsp;
                <span>{`+${cand.calling_code}`}</span>
              </Name>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default CountryCode;
