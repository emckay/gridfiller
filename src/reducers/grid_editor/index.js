import { combineReducers } from 'redux-immutable';
import undoable from 'redux-undo';
import { List, Map } from 'immutable';

import defaults from '../../defaults';

import gridReducer from '../grid';
import toolsReducer from '../tools';

import { handleApplyBorderWidthTool, handleApplyBorderStyleTool } from './border_styles';

const fillSharedOptions = (dynamicTool, sharedOptions) => {
    let tool = dynamicTool;
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
    return tool;
};

export const insert = (history, state, limit) => {
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
};

const handleApplyCellStyleTool = (currentState, action, tool) => {
    const presentGrid = currentState.get('grid').present;
    const filledTool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));
    const newGrid = presentGrid.mergeIn(
        ['cells', action.row, action.col, 'style'],
        filledTool.get('style')
    );
    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

const defaultValue = (style, target) => {
    switch (style) {
        case 'top': {
            return defaults.contentTop(target);
        }
        case 'left': {
            return defaults.contentLeft(target);
        }
        case 'fontSize': {
            return defaults.contentFontSize(target);
        }
        default: {
            return undefined;
        }
    }
};

const handleApplyContentStyleTool = (currentState, action, tool) => {
    const styleInd = ['cells', action.row, action.col, 'content', action.target, 'style'];
    const presentGrid = currentState.get('grid').present;
    const filledTool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));

    let newStyle = filledTool.get('style');

    const currentStyle = currentState.get('grid').present.getIn(styleInd);

    newStyle = newStyle.map((value, key) => {
        if (value instanceof List) {
            if (currentStyle !== undefined && currentStyle.get(key) !== undefined) {
                const newPos = (value.indexOf(currentStyle.get(key)) + 1) % value.size;
                return value.get(newPos);
            }
            return value.get(0);
        } else if (typeof value === 'string' && value.match(/[+\-]\d+/)) {
            const intValue = parseInt(value, 10);
            if (currentStyle !== undefined && currentStyle.get(key) !== undefined) {
                return currentStyle.get(key) + intValue;
            }
            return defaultValue(key, action.target) + intValue;
        }
        return value;
    });
    const newGrid = presentGrid.mergeIn(styleInd, newStyle);

    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

const handleApplyActiveStyleTool = (currentState, action) => {
    const tool = currentState.getIn(['tools', 'activeStyleTool']);
    const mode = currentState.getIn(['tools', 'activeStyleTool', 'mode']);

    if (tool === undefined) {
        return currentState;
    } else if (mode === undefined || mode === 'cell') {
        return handleApplyCellStyleTool(currentState, action, tool);
    } else if (mode === 'single-border') {
        if (tool.getIn(['style', 'width']) !== undefined) {
            return handleApplyBorderWidthTool(currentState, action, tool);
        }

        return handleApplyBorderStyleTool(currentState, action, tool);
    } else if (mode === 'mini-content-style' || mode === 'main-content-style') {
        return handleApplyContentStyleTool(currentState, action, tool);
    }

    return currentState;
};

const handleUpdateCellContent = (currentState, { text }) => {
    const target = currentState.getIn(['tools', 'activeCellContent']);

    if (target === undefined) return currentState;

    const currentGrid = currentState.get('grid').present;

    const newGrid = currentGrid.mergeIn([
        'cells',
        target.get('row'),
        target.get('col'),
        'content',
        target.get('contentId'),
    ], { text });

    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'APPLY_ACTIVE_STYLE_TOOL': {
            return handleApplyActiveStyleTool(currentState, action);
        }
        case 'UPDATE_CELL_CONTENT': {
            return handleUpdateCellContent(currentState, action);
        }
        default: {
            return combineReducers({
                grid: undoable(gridReducer),
                tools: toolsReducer,
            })(currentState, action);
        }
    }
}
