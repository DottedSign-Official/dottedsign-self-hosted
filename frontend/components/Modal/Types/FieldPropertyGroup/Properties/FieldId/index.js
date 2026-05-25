import Icon from "../../../../../Icon";
import Input from "../../../../../../containers/Input";
import {
  Content,
  Item,
  Items,
  WrapperLabel,
  ChkboxLabel,
  Selections,
  Selection,
  WrapperTips,
} from "../../styled";

const FieldId = ({
  t,
  groupId,
  itemsLocal,
  onGroupIdUpdate,
  onFieldIdUpdate,
  groupIdError,
  fieldIdErrors,
  isReadOnly,
}) => {
  return (
    <Content>
      <Items>
        <WrapperTips>
          <Icon type="tips" />
          <p>{t("modal_field_id_tips")}</p>
        </WrapperTips>

        <Item>
          <WrapperLabel>
            <ChkboxLabel>{t("modal_field_group_id")}</ChkboxLabel>
          </WrapperLabel>
          <Selections>
            <Selection>
              <Input
                length={60}
                isReadOnly={isReadOnly}
                value={groupId}
                onSubmit={onGroupIdUpdate}
                errorType={groupIdError}
              />
            </Selection>
          </Selections>
        </Item>

        <Item>
          <WrapperLabel>
            <ChkboxLabel>{t("modal_field_id")}</ChkboxLabel>
          </WrapperLabel>

          {itemsLocal.map((item, index) => (
            <Selections key={`${index}-${item.id}`}>
              <Selection>
                <Input
                  length={60}
                  isReadOnly={isReadOnly}
                  value={item.id}
                  onSubmit={(value) => onFieldIdUpdate(index, value)}
                  errorType={fieldIdErrors[index]}
                />
              </Selection>
            </Selections>
          ))}
        </Item>
      </Items>
    </Content>
  );
};

export default FieldId;
