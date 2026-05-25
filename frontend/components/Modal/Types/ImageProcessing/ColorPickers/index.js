import {
  Delete,
  Create,
  WrapperColorInput,
  ColorInput,
  InputCover,
  Wrapper,
  WrapperItem,
} from "./styled";
import Icon from "../../../../Icon";

const ColorPickers = ({ selectedColors, setSelectedColors, limit }) => {
  const handleColorChangeFactory = (index) => (event) => {
    const color = event.target.value;
    const current = [...selectedColors];
    current[index] = color;
    setSelectedColors(current);
  };

  const handleColorDeleteFactory = (index) => () => {
    setSelectedColors((prev) => prev.filter((_, idx) => index !== idx));
  };

  const handleAddColor = () => {
    setSelectedColors((prev) => [
      ...prev,
      prev.length ? prev[prev.length - 1] : "#ebebeb",
    ]);
  };

  return (
    <Wrapper>
      {selectedColors.map((selectedColor, index) => (
        <WrapperItem key={index}>
          <Delete onClick={handleColorDeleteFactory(index)}>
            <Icon type="close" />
          </Delete>
          <WrapperColorInput>
            <ColorInput
              type="color"
              value={selectedColor}
              onChange={handleColorChangeFactory(index)}
            />
            <InputCover color={selectedColor} />
          </WrapperColorInput>
        </WrapperItem>
      ))}
      {selectedColors.length < limit && (
        <Create onClick={handleAddColor}>
          <Icon type="plus" />
        </Create>
      )}
    </Wrapper>
  );
};

export default ColorPickers;
