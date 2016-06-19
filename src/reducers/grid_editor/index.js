import { combineReducers } from 'redux-seamless-immutable';
import undoable from 'redux-undo';
import immutable from 'seamless-immutable';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

import defaults from '../../defaults';
import { emptyContents } from '../../store/data/grids/empty_cell';

import gridReducer from '../grid';
import toolsReducer from '../tools';

import {
    handleApplyBorderWidthTool,
    handleApplyBorderStyleTool,
    handleResetSingleBorderTool,
} from './border_styles';

const fillSharedOptions = (dynamicTool, sharedOptions) => {
    let tool = dynamicTool;
    if (tool !== undefined) {
        for (const k of Object.keys(tool)) {
            const v = tool[k];
            if (v instanceof Object) {
                for (const style of Object.keys(v)) {
                    const value = v[style];
                    if (typeof value === 'function') {
                        tool = tool.setIn(
                            [k, style],
                            value(sharedOptions)
                        );
                    }
                }
            }
        }
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
    const presentGrid = currentState.grid.present;
    const filledTool = fillSharedOptions(tool, get(currentState, ['tools', 'sharedOptions']));

    let newGrid = presentGrid;
    for (const k of Object.keys(filledTool.style)) {
        newGrid = newGrid.setIn(['cells', action.row, action.col, 'style', k], filledTool.style[k]);
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
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
    const styleInd =
        ['cells', action.row, action.col, 'content', action.target, 'style'];
    const presentGrid = currentState.grid.present;
    const filledTool = fillSharedOptions(tool, get(currentState, ['tools', 'sharedOptions']));

    let newStyle = filledTool.style;
    const currentStyle = get(presentGrid, styleInd);

    newStyle = mapValues(newStyle, (value, key) => {
        if (value instanceof Array) {
            if (currentStyle !== undefined && currentStyle[key] !== undefined) {
                const newPos = (value.indexOf(currentStyle[key]) + 1) % value.length;
                return value[newPos];
            }
            return value[0];
        } else if (typeof value === 'string' && value.match(/[+\-]\d+/)) {
            const intValue = parseInt(value, 10);
            if (currentStyle !== undefined && currentStyle[key] !== undefined) {
                return currentStyle[key] + intValue;
            }
            return defaultValue(key, action.target) + intValue;
        }
        return value;
    });

    let newGrid = presentGrid;
    for (const style of Object.keys(newStyle)) {
        newGrid = newGrid.setIn([...styleInd, style], newStyle[style]);
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
};

const handleApplyClearTool = (currentState, action, tool) => {
    if (tool.clear === undefined) {
        return currentState;
    }

    if (tool.clear === 'all_content') {
        const contentInd = ['cells', action.row, action.col, 'content'];
        const presentGrid = currentState.grid.present;
        const newGrid = presentGrid.setIn(contentInd, emptyContents());
        return currentState.set('grid', insert(currentState.grid, newGrid));
    }

    return currentState;
};

const handleApplyActiveStyleTool = (currentState, action) => {
    const tool = get(currentState, ['tools', 'activeStyleTool']);
    const mode = get(currentState, ['tools', 'activeStyleTool', 'mode']);

    if (tool === undefined) {
        return currentState;
    } else if (mode === undefined || mode === 'cell') {
        return handleApplyCellStyleTool(currentState, action, tool);
    } else if (mode === 'single-border') {
        if (get(tool, ['style', 'width']) !== undefined) {
            return handleApplyBorderWidthTool(currentState, action, tool);
        } else if (tool.clear !== undefined) {
            return handleResetSingleBorderTool(currentState, action, tool);
        }

        return handleApplyBorderStyleTool(currentState, action, tool);
    } else if (mode === 'mini-content-style' || mode === 'main-content-style') {
        return handleApplyContentStyleTool(currentState, action, tool);
    } else if (mode === 'clear') {
        return handleApplyClearTool(currentState, action, tool);
    }

    return currentState;
};

const handleUpdateCellContent = (currentState, { text }) => {
    const target = get(currentState, ['tools', 'activeCellContent']);

    if (target === undefined) return currentState;

    const currentGrid = currentState.grid.present;

    const newGrid = currentGrid.setIn([
        'cells',
        target.row,
        target.col,
        'content',
        target.contentId,
        'text',
    ], text);

    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export default function (currentState = immutable({}), action) {
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
