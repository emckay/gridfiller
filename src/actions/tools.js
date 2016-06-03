export const toggleActiveStyleTool = (tool) => {
    return {
        type: 'TOGGLE_ACTIVE_STYLE_TOOL',
        tool,
    };
};

export const clearActiveStyleTool = () => {
    return { type: 'CLEAR_ACTIVE_STYLE_TOOL' };
};
