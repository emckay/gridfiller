
export const getGridEditor = (state) => state.gridEditor.present;
export const getCells = (state) => getGridEditor(state).getIn(['grid', 'cells']);
export const getTools = (state) => getGridEditor(state).get('tools');
export const getAvailableTools = (state) => getTools(state).get('availableTools');
export const getActiveStyleTool = (state) => getTools(state).get('activeStyleTool');
export const getSharedOptions = (state) => getTools(state).get('sharedOptions');
export const getPrimaryColor = (state) => getSharedOptions(state).get('primaryColor');
export const getSecondaryColor = (state) => getSharedOptions(state).get('secondaryColor');
