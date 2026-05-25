import { Block } from "../styled";
import Font from "../Properties/Font";

const TextField = ({ onUpdate, options, t }) => {
  const { alignment, alignmentFixed, fontSize, fontSizeFixed } = options;

  const onUpdateKeys = (props) => {
    onUpdate({ ...options, ...props });
  };

  return (
    <Block>
      <Font
        t={t}
        onChange={onUpdateKeys}
        fontSize={fontSizeFixed ? null : fontSize}
        alignment={alignmentFixed ? null : alignment}
      />
    </Block>
  );
};

export default TextField;
