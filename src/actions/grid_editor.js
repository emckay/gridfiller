export const applyActiveStyleTool = (row, col) => {
    return {
        type: 'APPLY_ACTIVE_STYLE_TOOL',
        row,
        col,
    };
};
