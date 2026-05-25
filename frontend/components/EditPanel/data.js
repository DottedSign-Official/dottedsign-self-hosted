import { panelTypes } from "../../constants/constants";

const panels = [
  {
    type: panelTypes.sign,
    text: "input_signature",
    icons: ["SignNor", "SignAct"],
  },
  {
    type: panelTypes.date,
    text: "input_date",
    icons: ["DateNor", "DateAct"],
  },
  {
    type: panelTypes.text,
    text: "input_text",
    icons: ["TextNor", "TextAct"],
  },
  {
    type: panelTypes.checkbox,
    text: "input_chkbox",
    icons: ["ChkboxNor", "ChkboxAct"],
  },
  {
    type: panelTypes.checkboxGroup,
    text: "input_chkbox_group",
    icons: ["ChkboxGroupNor", "ChkboxGroupAct"],
  },
  {
    type: panelTypes.radio,
    text: "input_radio",
    icons: ["RadioNor", "RadioAct"],
  },
  {
    type: panelTypes.radioGroup,
    text: "input_radio_group",
    icons: ["RadioGroupNor", "RadioGroupAct"],
  },
  {
    type: panelTypes.image,
    text: "input_image",
    icons: ["imageNor", "imageAct"],
  },
  {
    type: panelTypes.link,
    text: "input_link",
    icons: ["linkNor", "linkAct"],
  },
  {
    type: panelTypes.profile,
    text: "input_profile",
    icons: ["ProfileNor", "ProfileAct"],
  },
  {
    type: panelTypes.systemTime,
    text: "input_systemTime",
    icons: ["DateNor", "DateAct"],
  },
];

export default panels;
