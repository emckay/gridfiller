import { Map } from 'immutable';

const handleSetActiveStyleTool = (currentState, action) => {
    return currentState.set('activeStyleTool', action.tool);
};

const handleClearActiveStyleTool = (currentState) => {
    return currentState.set('activeStyleTool', undefined);
};

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'SET_ACTIVE_STYLE_TOOL':
            return handleSetActiveStyleTool(currentState, action);
        case 'CLEAR_ACTIVE_STYLE_TOOL':
            return handleClearActiveStyleTool(currentState);
        default:
            return currentState;
    }
}
