import React from "react";
import MoreActions from "../../containers/MoreActions";
import { GlobalBtn } from "../../global/styledBtn";
import {
  AutoGrowBlock,
  Title,
  List,
  ListItem,
  Col,
  Search,
  Conditions,
  Blank,
} from "./styled";

const MoreActionsList = ({
  title,
  settings: { titles, colsStyle, keys },
  data,
  editable,
  buttonAddText,
  handleAdd,
  handleEdit,
  handleRemove,
  handleKeywordSearch,
  searchValue,
  getActions,
  t,
}) => {
  const onBlur = (e) => {
    handleKeywordSearch(e.target.value);
  };

  const onKeyDown = (e) => {
    const isEnter = e.key === "Enter";

    if (isEnter) {
      e.target.blur();
    }
  };

  const Content = () => {
    return (
      <>
        {handleAdd && (
          <GlobalBtn theme="settingEdit" onClick={handleAdd}>
            {buttonAddText}
          </GlobalBtn>
        )}

        {handleKeywordSearch && (
          <Conditions>
            <Search
              tabIndex="56"
              defaultValue={searchValue}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              placeholder={t("placeholder_search")}
            />
          </Conditions>
        )}

        {data.length > 0 ? (
          <List cols={colsStyle}>
            <ListItem>
              {titles.map((title, index) => (
                <Col key={`list-title-col-${index}`} isTitle>
                  {t(title)}
                </Col>
              ))}
            </ListItem>
            {data.map((data, index) => {
              const actions = getActions
                ? getActions(data)
                : [
                    {
                      iconType: "editUnderline",
                      iconSize: "16px",
                      name: t("edit", { ns: "common" }),
                      func: () => {
                        handleEdit(data);
                      },
                    },
                    {
                      iconType: "trashcan",
                      iconSize: "16px",
                      name: t("delete", { ns: "common" }),
                      func: () => {
                        handleRemove(data);
                      },
                    },
                  ];
              return (
                <ListItem key={`list-item-${index}`}>
                  {keys.map((key, index) => (
                    <Col key={`list-col-${index}`}>{data[key]}</Col>
                  ))}

                  <Col align="right">
                    {editable[index] && !!actions.length && (
                      <MoreActions actions={actions} />
                    )}
                  </Col>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Blank>{t("label_not_found")}</Blank>
        )}
      </>
    );
  };

  return (
    <>
      <AutoGrowBlock>
        {title && <Title>{title}</Title>}
        <Content />
      </AutoGrowBlock>
    </>
  );
};

const Preprocessor = (props) => {
  const dataParser = ({
    data,
    handleAdd,
    handleEdit,
    handleRemove,
    settings,
  }) => {
    const isNotObjectArray = (data) => {
      return data?.length > 0 && typeof data[0] !== "object";
    };

    if (isNotObjectArray(data)) {
      const KEY = "value";
      const keys = [KEY];

      const callbackWrapper = (callback) => {
        return (data) => {
          callback(data[KEY]);
        };
      };

      return {
        settings: { ...settings, keys },
        data: data.map((label) => ({ [KEY]: label })),
        handleAdd: callbackWrapper(handleAdd),
        handleEdit: callbackWrapper(handleEdit),
        handleRemove: callbackWrapper(handleRemove),
      };
    }

    return {};
  };

  return <MoreActionsList {...props} {...dataParser(props)} />;
};

export default Preprocessor;
