import styled, { css } from "styled-components";

// NOTE: constants
export const color = {
  primary: "#586af2",
  primary_heavy: "#4958ca",
  primary_medium: "#bbc8f9",
  primary_light: "#d7def9",
  secondary: "#f7ba3e",
  hyperlink: "#007aff",
  coral: "#f25858",
  aqua: "#2dbcda",
  red: "#ff0000",
  butterscotch: "#f7ba3e",
  ds_text: "#1f2e4e",
  brownish_grey: "#707070",
  hint_solid: "#999999",
  black80: "rgba(0,0,0,.8)",
  black60: "rgba(0,0,0,.6)",
  black40: "rgba(0,0,0,.4)",
  black30: "rgba(0,0,0,.3)",
  black20: "rgba(0,0,0,.2)",
};

export const gbColor = {
  main: "#00BFA5",
  second: "#2D3E4E",
  third: "#96D200",
  gray: "rgba(0, 0, 0, 0.38)",
  bgGray: "#EFEFF4",
  lightGray: "#d8d8d8",
  deepGray: "#4d4d4d",
  hintGray: "#707070",
  lightBlack: "#222C38",
  errorMsg: "#FC2D55",
  purple: "#586af2",
  warn: "#f55f56",
  cancel: "rgba(0, 0, 0, 0.38)",
  systemBlue: "#409bf9",
  disabled: "rgb(245, 245, 245)",
  black12: "rgba(0, 0, 0, 0.12)",
  black87: "rgba(0, 0, 0, 0.87)",
  light_periwinkle: "#dadce3",
  hover: "rgba(0, 0, 0, 0.12)",
  active: "#f9f9f9",
  activeBack: "rgba(64, 155, 249, 0.3)",
  yellow: "#f7ba3e",
  highlight_yellow: "#e5ff0080",
  highlight_green: "#1aff00",
};

export const readOnlyColor = "#829296";
export const orderColor = [
  "#33bedb",
  "#f2a65a",
  "#c556e3",
  "#779fa1",
  "#773344",
  "#ff6542",
  "#0076ff",
  "#22d397",
];

export const myStatusColor = {
  waiting_for_me: "#f55f56",
  waiting_for_others: "#0076ff",
  completed: "#21d0a6",
  draft: "#e59e98",
};

export const statusColor = {
  original: "rgba(0, 0, 0, 0.38)",
  draft: "#e59e98",
  send: "#8e8e93",
  processing: "#0076ff",
  signed: "#21d0a6",
  pending: "#0076ff",
  waiting: "#00cafc",
  initial: "#00cafc",
  modifying: "#000000",
  reviewing: "#f55f56",
  reviewed: "#000000",
  done: "#21d0a6",
  canceled: "rgba(0, 0, 0, 0.38)",
  declined: "#f00",
};

export const mediaRule = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
};

export const zIndices = {
  // NOTE: modal
  modalCloseIcon: 10001,
  modalTitle: 10000,
  modalBack: 9999,

  // NOTE: fields
  groupFocus: 2,
  holder: 2,
  groupHolder: 3,

  // NOTE: other
  wrapperList: 9999,
};

// NOTE: components
export const PageWrapper = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.backcolor ? props.backcolor : "rgba(0,0,0,0)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: ${(props) => (props.isLock ? "hidden" : "auto")};
  justify-content: ${(props) => (props.isLoginPage ? "center" : "flex-start")};
`;

export const PageContainer = styled.section`
  margin-top: 56px;
  width: 100%;
  position: relative;
`;

export const taskWrapperWidth = css`
  position: relative;
  width: calc(288px * 5 + 8px * 10);

  @media (max-width: 1519px) {
    width: calc(288px * 4 + 8px * 8);
  }

  @media (max-width: 1215px) {
    width: calc(288px * 3 + 8px * 6);
  }

  @media (max-width: 911px) {
    width: calc(288px * 2 + 8px * 4);
  }

  @media (max-width: 607px) {
    width: calc(288px + 8px * 2);
  }
`;

export const TaskWrapper = styled.div`
  ${taskWrapperWidth};
  padding-bottom: 50px;
`;

export const Page = styled.div`
  direction: ltr;
  position: relative;
  overflow: visible;
  background-clip: content-box;
  display: inline-block;
  margin: auto;
  padding: 10px 0;
`;

export const Divider = styled.div`
  margin: 8px 0;
  height: 1px;
  background-color: #e0e0e0;
`;

export const DividerBtn = styled.div`
  display: inline-flex;
  width: 16px;
  height: 10px;

  @media (max-width: 480px) {
    width: 10px;
  }
`;

export const styleTag = css`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: black;
  padding: 5px;
  border-radius: 6px;
  margin: 5px 2px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const gbParam = {
  iconText: "8px",
};
