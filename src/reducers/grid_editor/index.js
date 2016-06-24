import { combineReducers } from 'redux-seamless-immutable';
import undoable from 'redux-undo';
import immutable from 'seamless-immutable';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';

import defaults from '../../defaults';
import { emptyContents } from '../../store/data/grids/empty_cell';

import { insert, runAndInsert, fillSharedOptions } from './helpers';

import gridReducer from '../grid';
import toolsReducer from '../tools';
import {
    handleToggleActiveCellContent,
    handleMoveActiveCellContent,
} from './active_cell_content';

import {
    handleApplyBorderWidthTool,
    handleApplyBorderStyleTool,
    clearBorderWidth,
    clearAllBorders,
} from './border_styles';

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


const clearAllContent = (cells, { row, col }) =>
    cells.setIn([row, col, 'content'], emptyContents());

const clearAll = (origCells, { row, col }) => {
    let cells = origCells;
    cells = clearAllContent(cells, { row, col });
    cells = clearAllBorders(cells, { row, col });
    cells = cells.setIn([row, col, 'style'], {});
    return cells;
};

const insertClearAllContent = runAndInsert(clearAllContent);
const insertClearAllBorders = runAndInsert(clearAllBorders);
const insertClearAll = runAndInsert(clearAll);

const handleApplyClearTool = (currentState, action, tool) => {
    if (tool.clear === undefined) {
        return currentState;
    }

    if (tool.clear === 'all_content') {
        return insertClearAllContent(currentState, action);
    } else if (tool.clear === 'all_borders') {
        return insertClearAllBorders(currentState, action);
    } else if (tool.clear === 'all') {
        return insertClearAll(currentState, action);
    }

    return currentState;
};

const insertClearBorderWidth = runAndInsert(clearBorderWidth);

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
            return insertClearBorderWidth(currentState, action, tool);
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
    const target = currentState.activeCellContent;

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
        case 'TOGGLE_ACTIVE_CELL_CONTENT': {
            return handleToggleActiveCellContent(currentState, action);
        }
        case 'MOVE_ACTIVE_CELL_CONTENT': {
            return handleMoveActiveCellContent(currentState, action);
        }
        default: {
            const nextState = combineReducers({
                grid: undoable(gridReducer),
                tools: toolsReducer,
            })(currentState, action);
            return currentState.merge(nextState);
        }
    }
}
