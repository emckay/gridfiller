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

export const createResetCheckpoint = () => ({
    type: 'CREATE_RESET_CHECKPOINT',
});

export const resetToCheckpoint = () => ({
    type: 'RESET_TO_CHECKPOINT',
});
