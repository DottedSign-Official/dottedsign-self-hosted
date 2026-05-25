import { PDF_TASK_PERSONAL_STATUS } from "../constants/constants";

const reg_signature = /<signature[^>]*>[\s\S]*?<\/signature>/g;

const reg_text =
  /<textfield(?=\s)(?![^>]*textfield-spe="textfield-date")[^>]*\/>/g;
const reg_text_signed =
  /<textfield(?![^>]*textfield-spe="textfield-date")[\s\S]*?<\/textfield>/g;

const reg_date = /<textfield[^>]*textfield-spe="textfield-date"[^>]*\/>/g;
const reg_date_signed =
  /<textfield[^>]*textfield-spe="textfield-date"[^>]*>[\s\S]*?<\/textfield>/g;

const reg_checkbox =
  /<checkbox[^>]*\bstyle\s*=\s*["']0["'][^>]*>[\s\S]*?<\/checkbox>/g;

const reg_radio =
  /<checkbox[^>]*\bstyle\s*=\s*["']1["'][^>]*>[\s\S]*?<\/checkbox>/g;

const reg_image =
  /<image[^>]*\bfieldname\s*=\s*["'][^"']+["'][^>]*>[\s\S]*?<\/image>/g;
const reg_link = /<link[^>]*>[\s\S]*?<\/link>/g;

const regs = [
  { regId: "signature", key: "signature", val: reg_signature },
  { regId: "text", key: "textfield", val: reg_text },
  { regId: "text_signed", key: "textfield", val: reg_text_signed },
  { regId: "date", key: "textfield", val: reg_date },
  { regId: "date_signed", key: "textfield", val: reg_date_signed },
  { regId: "checkbox", key: "checkbox", val: reg_checkbox },
  { regId: "radio", key: "checkbox", val: reg_radio },
  { regId: "image", key: "image", val: reg_image },
  { regId: "link", key: "link", val: reg_link },
];

const getValueByKey = (str, key) => {
  const str_fix = str.replace('">', '" > ');
  const kArr = str_fix.split(/[ ]+/);
  const strArr = kArr.filter((sub) => sub.indexOf(key) !== -1)[0];

  if (typeof strArr === "undefined") {
    return null;
  }

  if (key === "image") {
    const baseInd = strArr.indexOf("<image>");
    const endInd = strArr.indexOf("</image>");

    if (baseInd > -1) {
      return strArr.substring(baseInd + 7, endInd);
    }
    return null;
  }

  if (key === "value") {
    const baseInd = strArr.indexOf("<value>");
    const endInd = strArr.indexOf("</value>");

    if (baseInd > -1) {
      // NOTE: contain white space in input, check ori directly
      if (endInd === -1) {
        const baseInd = str_fix.indexOf("<value>");
        const endInd = str_fix.indexOf("</value>");

        return str_fix.substring(baseInd + 7, endInd);
      } else {
        return strArr.substring(baseInd + 7, endInd);
      }
    }
    return null;
  }

  let val;
  val = strArr.split('="')[1].replace('"', "");
  val = val.replace(">", "");

  return key === "rect" ? val.split(",") : val;
};

const getObj = (target, str, status, isMyTurn) => {
  regs.forEach((reg) => {
    const matches = str.match(reg.val);
    let coord, id, page, img, value, style, blockType;
    if (matches && matches.length > 0) {
      matches.forEach((ele) => {
        coord = getValueByKey(ele, "rect");
        id = getValueByKey(ele, "fieldname");
        page = getValueByKey(ele, "page");
        img = getValueByKey(ele, "image");
        value = getValueByKey(ele, "value");
        style = getValueByKey(ele, "style");
        blockType = reg.key;

        let aux = {};
        if (reg.regId === "signature") {
          if (status === PDF_TASK_PERSONAL_STATUS.processing) {
            if (!isMyTurn) {
              img = null;
            }
          } else if (
            status === PDF_TASK_PERSONAL_STATUS.initial ||
            status === PDF_TASK_PERSONAL_STATUS.declined ||
            status === PDF_TASK_PERSONAL_STATUS.canceled
          ) {
            img = null;
          } else {
            aux = { defaultText: "input_signature" };
          }
        }
        if (reg.regId === "text" || reg.regId === "text_signed") {
          aux.is_date = false;
          if (
            status === PDF_TASK_PERSONAL_STATUS.processing ||
            status === PDF_TASK_PERSONAL_STATUS.initial
          ) {
            value = "";
          } else {
            aux.defaultText = "input_text";
          }
        }
        if (reg.regId === "date" || reg.regId === "date_signed") {
          aux.is_date = true;

          if (
            status === PDF_TASK_PERSONAL_STATUS.processing ||
            status === PDF_TASK_PERSONAL_STATUS.initial
          ) {
            value = "";
          } else {
            aux.defaultText = "input_date";
          }
        }
        if (reg.regId === "checkbox" || reg.regId === "radio") {
          aux = { style: parseInt(style) };
        }
        if (reg.regId === "image") {
          if (
            status === PDF_TASK_PERSONAL_STATUS.processing ||
            status === PDF_TASK_PERSONAL_STATUS.initial
          ) {
            value = "";
          } else {
            aux.defaultText = "input_image";
          }
        }
        if (reg.regId === "link") {
          if (
            status === PDF_TASK_PERSONAL_STATUS.processing ||
            status === PDF_TASK_PERSONAL_STATUS.initial
          ) {
            value = "";
          } else {
            aux.defaultText = "input_link";
          }
        }

        target.push({
          type: blockType,
          coord,
          id,
          page: parseInt(page) + 1,
          img,
          value,
          ...aux,
        });
      });
    }
  });
};

const xfdf2Obj = (xfdf, status, isMyTurn) => {
  let result = [];

  if (xfdf) {
    getObj(result, xfdf, status, isMyTurn);
  }

  return result;
};

export default xfdf2Obj;
