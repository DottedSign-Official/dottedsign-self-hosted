import { STAMP_LAYOUT } from "../../../TextStampCanvas/data";

export const DEFAULT_STAMP_SETTINGS = {
  fontSize: 180,
  fontColor: "#FF0000",
  gap: 1,
  padding: 3,
  border: 25,
  borderColor: "#FF0000",
};

const STYLE_KEYS = {
  CHINESE_3_WORD: "STYLE_KEYS_CHINESE_3_WORD",
  CHINESE_RECT: "STYLE_KEYS_CHINESE_RECT",
  CHINESE_ROW: "STYLE_KEYS_CHINESE_ROW",
  ROW: "STYLE_KEYS_ROW",
};

export const styles = {
  [STYLE_KEYS.CHINESE_3_WORD]: {
    layout: STAMP_LAYOUT.CHINESE_3_WORD,
    isChinese: true,
    fontFamily: "Noto Sans TC",
    ...DEFAULT_STAMP_SETTINGS,
  },
  [STYLE_KEYS.CHINESE_RECT]: {
    layout: STAMP_LAYOUT.CHINESE_RECT,
    isChinese: true,
    fontFamily: "Noto Sans TC",
    ...DEFAULT_STAMP_SETTINGS,
  },
  [STYLE_KEYS.CHINESE_ROW]: {
    layout: STAMP_LAYOUT.CHINESE_ROW,
    isChinese: true,
    fontFamily: "Noto Sans TC",
    ...DEFAULT_STAMP_SETTINGS,
  },
  [STYLE_KEYS.ROW]: {
    layout: STAMP_LAYOUT.ROW,
    isChinese: false,
    ...DEFAULT_STAMP_SETTINGS,
    fontFamily: "Noto Sans",
  },
};

export const getStyleSelections = (t) => [
  {
    key: STYLE_KEYS.CHINESE_3_WORD,
    text: t("create_stamp_style1_chinese_3word"),
  },
  {
    key: STYLE_KEYS.CHINESE_RECT,
    text: t("create_stamp_style2_rectangle"),
  },
  {
    key: STYLE_KEYS.CHINESE_ROW,
    text: t("create_stamp_style3_chinese_row"),
  },
  {
    key: STYLE_KEYS.ROW,
    text: t("create_stamp_style4_row"),
  },
];
