export const setActiveStyleTool = (tool) => {
    return {
        type: 'SET_ACTIVE_STYLE_TOOL',
        tool,
    };
};

export const clearActiveStyleTool = () => {
    return { type: 'CLEAR_ACTIVE_STYLE_TOOL' };
};
