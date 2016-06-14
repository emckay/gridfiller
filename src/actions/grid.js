export const setStyle = (row, col, style) => ({
    type: 'SET_STYLE',
    row,
    col,
    style,
});

export const importGrid = (compressedGrid) => ({
    type: 'IMPORT_GRID',
    compressedGrid,
});
