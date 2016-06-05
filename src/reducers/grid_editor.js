import { combineReducers } from 'redux-immutable';
import undoable from 'redux-undo';
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

function insert(history, state, limit) {
    const { past, present } = history;
    const historyOverflow = limit && length(history) >= limit;

    const newPast = history.wasFiltered ? past : [
        ...past.slice(historyOverflow ? 1 : 0),
        present,
    ];

    return {
        past: newPast,
        present: state,
        future: [],
    };
}

const handleApplyActiveStyleTool = (currentState, action) => {
    let tool = currentState.getIn(['tools', 'activeStyleTool']);

    if (tool !== undefined) {
        const presentGrid = currentState.get('grid').present;
        tool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));
        const newGrid = presentGrid.setIn(
            ['cells', action.row, action.col, 'style'],
            tool.get('style')
        );
        return currentState.set('grid', insert(currentState.get('grid'), newGrid));
    }

    return currentState;
};

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'APPLY_ACTIVE_STYLE_TOOL': {
            return handleApplyActiveStyleTool(currentState, action);
        }
        default: {
            return combineReducers({
                grid: undoable(gridReducer),
                tools: toolsReducer,
            })(currentState, action);
        }
    }
}
