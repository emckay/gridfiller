import { Map } from 'immutable';

import gridReducer from './grid';
import toolsReducer from './tools';

const handleApplyActiveStyleTool = (currentState, action) => {
    if (currentState.getIn(['tools', 'activeStyleTool', 'style']) !== undefined) {
        return currentState.setIn(
            ['grid', 'cells', action.row, action.col, 'style'],
            currentState.getIn(['tools', 'activeStyleTool', 'style'])
        );
    }

    return currentState;
};

export default function (currentState = new Map(), action) {
    let nextState;

    switch (action.type) {
        case 'APPLY_ACTIVE_STYLE_TOOL': {
            nextState = handleApplyActiveStyleTool(currentState, action);
            break;
        }
        default: {
            nextState = currentState;
            nextState = nextState.set('grid', gridReducer(nextState.get('grid'), action));
            nextState = nextState.set('tools', toolsReducer(nextState.get('tools'), action));
        }
    }
    return nextState;
}
