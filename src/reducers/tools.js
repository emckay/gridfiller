import { Map } from 'immutable';

const handleToggleActiveStyleTool = (currentState, action) => {
    if (currentState.get('activeStyleTool') === action.tool) {
        return currentState.set('activeStyleTool', undefined);
    }

    return currentState.set('activeStyleTool', action.tool);
};

const handleClearActiveStyleTool = (currentState) => {
    return currentState.set('activeStyleTool', undefined);
};

const handleSetSharedOption = (currentState, key, value) => {
    return currentState.setIn(['sharedOptions', key], value);
};

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
