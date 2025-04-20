export const customSortRow = (cellA, cellB, { sortDirection, sortStates, locale }) => {
    if (sortDirection === sortStates.DESC) {
        return typeof cellB === 'string'
            ? cellB.localeCompare(cellA, locale)
            : cellB - cellA;
    }
    return typeof cellA === 'string'
        ? cellA.localeCompare(cellB, locale)
        : cellA - cellB;
};

