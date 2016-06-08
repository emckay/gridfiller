import { Map } from 'immutable';

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
        default:
            return currentState;
    }
}
