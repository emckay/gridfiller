export const applyActiveStyleTool = (row, col, target) => ({
    type: 'APPLY_ACTIVE_STYLE_TOOL',
    row,
    col,
    target,
});

export const updateCellContent = (text) => ({
    type: 'UPDATE_CELL_CONTENT',
    text,
});
