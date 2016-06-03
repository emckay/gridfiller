export const setStyle = (row, col, style) => {
    return {
        type: 'SET_STYLE',
        row,
        col,
        style,
    };
};
