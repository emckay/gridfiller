
export const getGridEditor = (state) => state.gridEditor;
export const getGrid = (state) => getGridEditor(state).get('grid').present;
export const getCells = (state) => getGrid(state).get('cells');
export const getTools = (state) => getGridEditor(state).get('tools');
export const getAvailableTools = (state) => getTools(state).get('availableTools');
export const getActiveStyleTool = (state) => getTools(state).get('activeStyleTool');
export const getSharedOptions = (state) => getTools(state).get('sharedOptions');
export const getPrimaryColor = (state) => getSharedOptions(state).get('primaryColor');
export const getSecondaryColor = (state) => getSharedOptions(state).get('secondaryColor');
export const getMode = (state) => getTools(state).get('mode');
