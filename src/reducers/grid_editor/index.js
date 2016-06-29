import { combineReducers } from 'redux-seamless-immutable';
import undoable from 'redux-undo';
import immutable from 'seamless-immutable';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

import defaults from '../../defaults';
import { emptyContents } from '../../store/data/grids/empty_cell';

import {
    insert,
    runAndInsert,
    fillSharedOptions,
    activeGrid,
} from './helpers';

import gridReducer from '../grid';
import toolsReducer from '../tools';
import {
    handleToggleActiveCellContent,
    handleMoveActiveCellContent,
} from './active_cell_content';

import {
    insertChangeBorderWidth,
    insertToggleBorderStyle,
    clearBorderWidth,
    clearAllBorders,
} from './border_styles';

const applyCellStyle = (cells, action, tool, sharedOptions) => {
    const filledTool = fillSharedOptions(tool, sharedOptions);

    let newCells = cells;
    for (const k of Object.keys(filledTool.style)) {
        newCells = newCells.setIn([action.row, action.col, 'style', k], filledTool.style[k]);
    }

    return newCells;
};

const handleApplyCellStyleTool = runAndInsert(applyCellStyle);

const pasteCell = (cells, copiedCell, sourceGrid, targetCellInd) => {
    let newCells = cells;

    const borderStyles = pickBy(copiedCell.style, (v, k) => k.includes('border'));
    const nonBorderStyles = pickBy(copiedCell.style, (v, k) => !k.includes('border'));

    newCells = newCells.setIn(
        [...targetCellInd, 'style'],
        nonBorderStyles
    );

    newCells = newCells.setIn(
        [...targetCellInd, 'content'],
        copiedCell.content
    );

    return newCells;
};

const insertPasteCell = runAndInsert(pasteCell);

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
        return insertClearAllContent(currentState, action.gridId, action);
    } else if (tool.clear === 'all_borders') {
        return insertClearAllBorders(currentState, action.gridId, action);
    } else if (tool.clear === 'all') {
        return insertClearAll(currentState, action.gridId, action);
    }

    return currentState;
};

const insertClearBorderWidth = runAndInsert(clearBorderWidth);

const handleApplyActiveStyleTool = (currentState, action) => {
    const tool = get(currentState, ['tools', 'activeStyleTool']);
    const mode = get(currentState, ['tools', 'activeStyleTool', 'mode']) || 'cell';

    if (tool === undefined) {
        return currentState;
    } else if (mode === 'cell' && tool.style !== undefined) {
        return handleApplyCellStyleTool(
            currentState,
            action.gridId,
            action,
            tool,
            get(currentState, ['tools', 'sharedOptions'])
        );
    } else if (mode === 'single-border') {
        if (get(tool, ['style', 'width']) !== undefined) {
            const widthDelta = get(tool, ['style', 'width']);
            return insertChangeBorderWidth(currentState, action.gridId, { widthDelta, ...action });
        } else if (tool.clear !== undefined) {
            return insertClearBorderWidth(currentState, action.gridId, action, tool);
        }
        return insertToggleBorderStyle(currentState, action.gridId, action, tool.style.style);
    } else if (mode === 'mini-content-style' || mode === 'main-content-style') {
        return handleApplyContentStyleTool(currentState, action, tool);
    } else if (mode === 'clear') {
        return handleApplyClearTool(currentState, action, tool);
    }

    if (tool.copy === 'cell') {
        return currentState.set('copiedCell', {
            row: action.row,
            col: action.col,
            gridId: action.gridId,
        });
    }

    if (tool.paste === 'cell') {
        const ind = currentState.copiedCell;
        if (ind === undefined) return currentState;
        const copiedCell = get(activeGrid(currentState, ind.gridId), [ind.row, ind.col]);

        return insertPasteCell(
            currentState,
            action.gridId,
            copiedCell,
            activeGrid(currentState, action.gridId),
            [action.row, action.col]
        );
    }

    return currentState;
};

const updateCellContent = (cells, target, { text }) => {
    if (target === undefined) return cells;

    return cells.setIn([
        target.row,
        target.col,
        'content',
        target.contentId,
        'text',
    ], text);
};

const insertUpdateCellContent = runAndInsert(updateCellContent);

export default function (currentState = immutable({}), action) {
    switch (action.type) {
        case 'APPLY_ACTIVE_STYLE_TOOL': {
            return handleApplyActiveStyleTool(currentState, action);
        }
        case 'UPDATE_CELL_CONTENT': {
            const target = currentState.activeCellContent;
            if (target === undefined) {
                return currentState;
            }
            return insertUpdateCellContent(currentState, target.gridId, target, action);
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
