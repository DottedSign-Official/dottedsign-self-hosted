import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import tooltip, { POSITION } from "../../constants/tooltip";
import Tooltip from "../../containers/Tooltip";
import Icon from "../Icon";
import {
  Wrapper,
  Main,
  Count,
  Panel,
  Title,
  WrapperTooltip,
  Tags,
  Tag,
} from "./styled";

// TYPE: tag_info = { [key: string]: boolean };

const TagCounter = ({ tag_info }) => {
  const { t } = useTranslation("common");
  const refTimer = useRef();
  const [isCollapse, setIsCollapse] = useState(true);

  const countLabels = (() => {
    const combined = {
      ...(tag_info || {}),
    };

    return Object.keys(combined).filter((tag) => combined[tag]).length;
  })();

  const isTagExist = countLabels > 0;

  const onFocus = () => {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
  };

  const onBlur = () => {
    refTimer.current = setTimeout(() => {
      setIsCollapse(true);
    });
  };

  const onBtnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapse(!isCollapse);
  };

  const onPanelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isTagExist) {
    return null;
  }

  // NOTE: currently hide, will turn on conditionally in the future.
  const isTooltip = false;

  return (
    <Wrapper tabIndex={9} onFocus={onFocus} onBlur={onBlur}>
      <Main onClick={onBtnClick}>
        <Icon type="tag" size="16px" />
        <Count
          dangerouslySetInnerHTML={{
            __html: t("tag_count", { count: countLabels }),
          }}
        />
      </Main>

      {!isCollapse && (
        <Panel onClick={onPanelClick}>
          <Title>
            <h3>{t("search_label_filter")}</h3>

            {isTooltip && (
              <WrapperTooltip>
                <Tooltip type={tooltip.labels} position={POSITION.top} />
              </WrapperTooltip>
            )}
          </Title>

          <Tags>
            {tag_info &&
              Object.keys(tag_info).map((key) => {
                if (tag_info[key]) {
                  return <Tag key={key}>{key}</Tag>;
                }
                return null;
              })}
          </Tags>
        </Panel>
      )}
    </Wrapper>
  );
};

export default TagCounter;
