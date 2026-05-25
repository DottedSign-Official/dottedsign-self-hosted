export const STAMP_LAYOUT = {
  CHINESE_3_WORD: "CHINESE_3_WORD",
  CHINESE_ROW: "CHINESE_ROW",
  ROW: "ROW",
  CHINESE_RECT: "CHINESE_RECT",
};

export const layoutGenerator = {
  [STAMP_LAYOUT.CHINESE_3_WORD]: () => [
    [1, 0],
    [2, 0],
  ],
  [STAMP_LAYOUT.CHINESE_ROW]: (text) => {
    const length = text.length;
    return [Array.from({ length: length }, (_, i) => length - i - 1)];
  },
  [STAMP_LAYOUT.ROW]: (text) => {
    const length = text.length;
    return [Array.from({ length: length }, (_, i) => i)];
  },
  [STAMP_LAYOUT.CHINESE_RECT]: (text) => {
    const length = text.length;
    const row = Math.ceil(Math.sqrt(length));
    const col = Math.ceil(length / row);
    const result = Array.from({ length: row }, (_, i) =>
      Array.from({ length: col }, (_, j) => (col - j - 1) * row + i),
    );

    return result;
  },
};
