import { Map } from 'immutable';

const handletoggleActiveStyleTool = (currentState, action) => {
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

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'TOGGLE_ACTIVE_STYLE_TOOL':
            return handletoggleActiveStyleTool(currentState, action);
        case 'CLEAR_ACTIVE_STYLE_TOOL':
            return handleClearActiveStyleTool(currentState);
        case 'SET_SHARED_OPTION':
            return handleSetSharedOption(currentState, action.key, action.value);
        default:
            return currentState;
    }
}
