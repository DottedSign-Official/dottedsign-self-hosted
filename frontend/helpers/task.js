export const filterPageInvolversByFileId = (pageInvolvers, targetFileId) => {
  const result = {};

  for (const pageKey in pageInvolvers) {
    const filteredItems = pageInvolvers[pageKey].filter(
      (item) => item.taskId === targetFileId,
    );

    if (filteredItems.length > 0) {
      result[pageKey] = filteredItems;
    }
  }

  return result;
};
