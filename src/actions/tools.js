export const toggleActiveStyleTool = (tool, mode) => ({
    type: 'TOGGLE_ACTIVE_STYLE_TOOL',
    tool,
    mode,
});

export const clearActiveStyleTool = () => ({ type: 'CLEAR_ACTIVE_STYLE_TOOL' });

export const setSharedOption = (key, value) => ({
    type: 'SET_SHARED_OPTION',
    key,
    value,
});

export const swapColors = () => ({ type: 'SWAP_COLORS' });

export const toggleActiveCellContent = (row, col, contentId) => ({
    type: 'TOGGLE_ACTIVE_CELL_CONTENT',
    row,
    col,
    contentId,
});
