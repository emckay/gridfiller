export const applyActiveStyleTool = (row, col, { target, gridId } = { }) => ({
    type: 'APPLY_ACTIVE_STYLE_TOOL',
    row,
    col,
    target,
    gridId,
});

export const updateCellContent = (text) => ({
    type: 'UPDATE_CELL_CONTENT',
    text,
});

export const moveActiveCellContent = (direction) => ({
    type: 'MOVE_ACTIVE_CELL_CONTENT',
    direction,
});
