export const getRenderPage = ({ viewable_source_files, files }) => {
  if (!viewable_source_files?.length || !files?.length) {
    return [];
  }

  let curPageAt = 1;
  const pages = files.reduce((acc, file) => {
    const isVisible = viewable_source_files?.some((vFile) => {
      const fileUid = file.file_object_id || file.uid;
      if (typeof vFile === "string") {
        return vFile === fileUid;
      }

      return vFile.file_object_id === fileUid && vFile.accessible;
    });

    const count = file.pages || file.page_count;

    if (!isVisible) {
      curPageAt = curPageAt + count;
      return acc;
    }

    const renderRange = [...Array(count)].map((_, i) => curPageAt + i);
    curPageAt = curPageAt + count;
    return [...acc, ...renderRange];
  }, []);

  return pages;
};
