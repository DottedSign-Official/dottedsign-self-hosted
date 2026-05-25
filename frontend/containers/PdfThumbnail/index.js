import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PDF_TASK_PERSONAL_STATUS } from "../../constants/constants";
import { scrollToDom } from "../../helpers/dom";
import onBlur from "../../helpers/onBlur";
import PdfThumbnail from "../../components/PdfThumbnail";

const PdfThumbnailContainer = ({ isInSigningPhase }) => {
  const blurRef = useRef();
  const prevFileFocus = useRef();
  const [isPanel, setIsPanel] = useState(false);
  const [isCollapse, setIsCollapse] = useState(true);
  const [mode, setMode] = useState("all");
  const [thumbActive, setThumbActive] = useState(1);

  const [pageAll, setPageAll] = useState([]);
  const [pageMy, setPageMy] = useState([]);
  const [pageTasks, setPageTasks] = useState([]);
  const [pageVisible, setPageVisible] = useState([]);

  const { isEnvelope } = useSelector((state) =>
    isInSigningPhase ? state.sign : state.create,
  );

  const { fileFocus } = useSelector((state) =>
    isInSigningPhase ? state.sign : state.create,
  );

  const { totalPage } = useSelector((state) => state.pdf);
  const { isExpired, taskBlocks, pageInvolvers, pdf } = useSelector(
    (state) => state.sign,
  );

  useEffect(() => {
    const blur = blurRef;
    return () => clearTimeout(blur.current);
  }, []);

  useEffect(() => {
    if (isPanel) {
      scrollToDom(`thumb_${thumbActive}`);
    }
  }, [isPanel, thumbActive]);

  useEffect(() => {
    if (!isEnvelope) {
      return;
    }
    if (!prevFileFocus.current) {
      prevFileFocus.current = fileFocus;
      return;
    }
    if (fileFocus && prevFileFocus.current !== fileFocus) {
      setThumbActive(1);
      scrollToDom(`pageContainer${1}`);
      prevFileFocus.current = fileFocus;
    }
  }, [isEnvelope, prevFileFocus, fileFocus]);

  useEffect(() => {
    if (totalPage && totalPage > 0) {
      let pages = [];
      [...Array(totalPage)].forEach((_, idx) => pages.push(idx + 1));
      setPageAll(pages);
      setPageVisible(pages);
    }
  }, [totalPage]);

  useEffect(() => {
    if (!isExpired && taskBlocks && pageInvolvers) {
      // NOTE: tasks
      if (pageInvolvers) {
        const pages = Object.keys(pageInvolvers).map((key) =>
          parseInt(key.substring(5)),
        );
        setPageTasks(pages.sort((a, b) => a - b));
      }

      // NOTE: mine
      const myBlocks = taskBlocks.filter(
        (blk) =>
          blk.isMyTurn && blk.status === PDF_TASK_PERSONAL_STATUS.processing,
      );

      const myBlock = myBlocks[0];
      if (myBlock) {
        const signBlocks = myBlock.blocks;
        let pgs = [];
        signBlocks.map((blk) => {
          const pg = parseInt(blk.page);

          if (pgs.indexOf(pg) === -1) {
            pgs.push(pg);
          }
        });
        setPageMy(pgs.sort((a, b) => a - b));
      }
    }
  }, [isExpired, taskBlocks, pageInvolvers]);

  if (!totalPage || totalPage < 1) {
    return null;
  }

  const onPanelOn = () => setIsPanel(true);

  const onPanelOff = () => setIsPanel(false);

  const onModeToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const onModeCollapse = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setIsCollapse(true))(e);
  };

  const onModeSelect = (mod) => {
    if (mod === "fields") {
      setPageVisible(pageTasks);
    } else if (mod === "myFields") {
      setPageVisible(pageMy);
    } else {
      setPageVisible(pageAll);
    }

    setMode(mod);
    setIsCollapse(true);
  };

  const onChangePage = (idx) => {
    setThumbActive(idx);
    scrollToDom(`pageContainer${idx}`);
  };

  const isMenu = pdf?.sideBar?.showFilter;

  return (
    <PdfThumbnail
      isPanel={isPanel}
      onPanelOn={onPanelOn}
      onPanelOff={onPanelOff}
      currentPage={thumbActive}
      onChangePage={onChangePage}
      isMenu={isMenu}
      isCollapse={isCollapse}
      onModeToggle={onModeToggle}
      onModeCollapse={onModeCollapse}
      onModeSelect={onModeSelect}
      mode={mode}
      pageInvolvers={pageInvolvers}
      pageVisible={pageVisible}
      fileFocus={fileFocus}
    />
  );
};

export default PdfThumbnailContainer;
