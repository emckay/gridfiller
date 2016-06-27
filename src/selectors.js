export const getGridEditor = (state) => state.gridEditor;
export const getGrid = (state) => getGridEditor(state).grid.present;
export const getCells = (state) => getGrid(state).cells;
export const getTools = (state) => getGridEditor(state).tools;
export const getSideTools = (state) => getTools(state).sideTools;
export const getTopTools = (state) => getTools(state).topTools;
export const getActiveStyleTool = (state) => getTools(state).activeStyleTool;
export const getSharedOptions = (state) => getTools(state).sharedOptions;
export const getPrimaryColor = (state) => getSharedOptions(state).primaryColor;
export const getSecondaryColor = (state) => getSharedOptions(state).secondaryColor;
export const getMode = (state) => {
    if (getActiveStyleTool(state)) return getActiveStyleTool(state).mode;
    return 'view';
};
export const getActiveCellContent = (state) => getGridEditor(state).activeCellContent;
export const getGallery = (state) => getGrid(state).gallery;

export default {
    getGridEditor,
    getGrid,
    getCells,
    getTools,
    getSideTools,
    getTopTools,
    getActiveStyleTool,
    getSharedOptions,
    getPrimaryColor,
    getSecondaryColor,
    getMode,
    getActiveCellContent,
    getGallery,
};
