import { Map } from 'immutable';

import gridReducer from './grid';
import toolsReducer from './tools';

const fillSharedOptions = (dynamicTool, sharedOptions) => {
    let tool = dynamicTool;
    if (tool !== undefined) {
        if (tool !== undefined) {
            tool.forEach((v, k) => {
                if (v instanceof Map) {
                    for (const [style, value] of v) {
                        if (typeof value === 'function') {
                            tool = tool.setIn(
                                [k, style],
                                value(sharedOptions)
                            );
                        }
                    }
                }
            });
        }
    }
    return tool;
};

const handleApplyActiveStyleTool = (currentState, action) => {
    let tool = currentState.getIn(['tools', 'activeStyleTool']);

    if (tool !== undefined) {
        tool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));
        return currentState.setIn(
            ['grid', 'cells', action.row, action.col, 'style'],
            tool.get('style')
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
