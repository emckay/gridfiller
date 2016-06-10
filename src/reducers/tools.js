import { Map, List } from 'immutable';

const handleClearActiveStyleTool = (currentState) => {
    const newState = { activeStyleTool: undefined, mode: undefined };
    return currentState.merge(newState);
};

const handleToggleActiveStyleTool = (currentState, action) => {
    if (currentState.get('activeStyleTool') === action.tool) {
        return handleClearActiveStyleTool(currentState);
    }

    const newState = { activeStyleTool: action.tool, mode: action.mode };
    return currentState.merge(newState);
};

const handleSetSharedOption = (currentState, key, value) =>
    currentState.setIn(['sharedOptions', key], value);

const handleSwapColors = (currentState) => {
    const primaryColor = currentState.getIn(['sharedOptions', 'primaryColor']);
    const secondaryColor = currentState.getIn(['sharedOptions', 'secondaryColor']);
    return currentState.setIn(
        ['sharedOptions', 'primaryColor'],
        secondaryColor
    ).setIn(['sharedOptions', 'secondaryColor'], primaryColor);
};

const handleToggleActiveCellContent = (currentState, { row, col, contentId }) => {
    const currentActive = currentState.get('activeCellContent');
    let different = false;

    if (currentActive !== undefined) {
        if (row !== currentActive.get('row')) different = true;
        if (col !== currentActive.get('col')) different = true;
        if (contentId !== currentActive.get('contentId')) different = true;
    }

    if (currentActive === undefined || different) {
        return currentState.set('activeCellContent', new Map({ row, col, contentId }));
    }

    return currentState.set('activeCellContent', undefined);
};

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'TOGGLE_ACTIVE_STYLE_TOOL':
            return handleToggleActiveStyleTool(currentState, action);
        case 'CLEAR_ACTIVE_STYLE_TOOL':
            return handleClearActiveStyleTool(currentState);
        case 'SET_SHARED_OPTION':
            return handleSetSharedOption(currentState, action.key, action.value);
        case 'SWAP_COLORS':
            return handleSwapColors(currentState);
        case 'TOGGLE_ACTIVE_CELL_CONTENT':
            return handleToggleActiveCellContent(currentState, action);
        default:
            return currentState;
    }
}
