import { useSelector } from "react-redux";
import Checkbox from "../../../../Checkbox";
import Tooltip from "../../../../TooltipExtend";
import { Wrapper, Label, Item } from "./styled";

const CheckboxList = ({
  templateId,
  selectedGroups,
  organizationList,
  handleCheckboxChange,
}) => {
  const { templateShareList } = useSelector((state) => state.template);

  const sharingGroupIds = templateShareList
    .filter((template) => template.template_id === templateId)
    .map((template) => template.share_groups)
    .flat()
    .map((group) => group.group_id);

  return (
    <Wrapper>
      {organizationList.map((group) => (
        <Item key={group.group_id}>
          <Checkbox
            id={group.group_id}
            isChecked={
              sharingGroupIds.includes(group.group_id) ||
              selectedGroups.includes(group.group_id)
            }
            onToggle={() => handleCheckboxChange(group.group_id)}
            isReadOnly={sharingGroupIds.includes(group.group_id)}
          />
          <Label>
            <Tooltip text={group.name} />
          </Label>
        </Item>
      ))}
    </Wrapper>
  );
};

export default CheckboxList;
