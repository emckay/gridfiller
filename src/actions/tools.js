export const toggleActiveStyleTool = (tool) => {
    return {
        type: 'TOGGLE_ACTIVE_STYLE_TOOL',
        tool,
    };
};

export const clearActiveStyleTool = () => {
    return { type: 'CLEAR_ACTIVE_STYLE_TOOL' };
};

export const setSharedOption = (key, value) => {
    return {
        type: 'SET_SHARED_OPTION',
        key,
        value,
    };
};

export const swapColors = () => {
    return { type: 'SWAP_COLORS' };
};
