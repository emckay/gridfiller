export const toggleActiveStyleTool = (tool) => ({
    type: 'TOGGLE_ACTIVE_STYLE_TOOL',
    tool,
});

export const clearActiveStyleTool = () => ({ type: 'CLEAR_ACTIVE_STYLE_TOOL' });

export const setSharedOption = (key, value) => ({
    type: 'SET_SHARED_OPTION',
    key,
    value,
});

export const swapColors = () => ({ type: 'SWAP_COLORS' });
