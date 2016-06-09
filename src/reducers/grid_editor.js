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

const handleApplyCellStyleTool = (currentState, action, tool) => {
    const presentGrid = currentState.get('grid').present;
    const filledTool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));
    const newGrid = presentGrid.setIn(
        ['cells', action.row, action.col, 'style'],
        filledTool.get('style')
    );
    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

const handleApplyBorderStyleTool = (currentState, action, tool) => {
    const cells = currentState.get('grid').present.get('cells');

    // find correct cell/border to change
    let targetCell;
    let targetBorder;
    if (action.target === 0 || action.target === 3) {
        // if changing top or left border, use the original cell
        targetCell = [action.row, action.col];
        if (action.target === 0) {
            targetBorder = 'borderTop';
        } else {
            targetBorder = 'borderLeft';
        }
    } else if (action.target === 1) {
        // changing right border -- need to check if we are in right-most col
        const numCols = cells.get(0).size;
        if (action.col === numCols - 1) {
            targetCell = [action.row, action.col];
            targetBorder = 'borderRight';
        } else {
            targetCell = [action.row, action.col + 1];
            targetBorder = 'borderLeft';
        }
    } else {
        // changing bottom border -- need to check if we are in bottom-most row
        const numRows = cells.size;
        if (action.row === numRows - 1) {
            targetCell = [action.row, action.col];
            targetBorder = 'borderBottom';
        } else {
            targetCell = [action.row + 1, action.col];
            targetBorder = 'borderTop';
        }
    }

    let targetMargin;
    let targetDim;

    if (targetBorder === 'borderTop' || targetBorder === 'borderBottom') {
        targetMargin = 'marginTop';
        targetDim = 'height';
    } else {
        targetMargin = 'marginLeft';
        targetDim = 'width';
    }

    const newStyle = { };
    if (tool.getIn(['style', 'width'])) {
        const targetStyle = `${targetBorder}Width`;
        let origWidth = cells.getIn([...targetCell, 'style', targetStyle]) || 1;
        let origMargin = cells.getIn([...targetCell, 'style', targetMargin]) || 0;
        let origDim = cells.getIn([...targetCell, 'style', targetDim]) || 50;

        if (typeof origStyle === 'string') origWidth = parseInt(origWidth.replace('px', ''), 10);
        if (typeof origMargin === 'string') origMargin = parseInt(origWidth.replace('px', ''), 10);
        if (typeof origDim === 'string') origDim = parseInt(origWidth.replace('px', ''), 10);

        if (tool.getIn(['style', 'width', '+='])) {
            newStyle[targetStyle] = origWidth + tool.getIn(['style', 'width', '+=']);
            newStyle[targetMargin] = origMargin - tool.getIn(['style', 'margin', '-=']);
            newStyle[targetDim] = origDim - tool.getIn(['style', 'dim', '-=']);
        } else if (tool.getIn(['style', 'width', '-='])) {
            newStyle[targetStyle] = origWidth - tool.getIn(['style', 'width', '-=']);
            newStyle[targetMargin] = origMargin - tool.getIn(['style', 'margin', '-=']);
            newStyle[targetDim] = origDim - tool.getIn(['style', 'dim', '-=']);
        }
    }

    const newGrid = currentState.get('grid').present
        .mergeIn(['cells', ...targetCell, 'style'], newStyle);

    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

const handleApplyActiveStyleTool = (currentState, action) => {
    const mode = currentState.getIn(['tools', 'mode']);
    const tool = currentState.getIn(['tools', 'activeStyleTool']);

    if (tool === undefined) {
        return currentState;
    } else if (mode === undefined || mode.toLowerCase() === 'cell') {
        return handleApplyCellStyleTool(currentState, action, tool);
    } else if (mode.toLowerCase() === 'border') {
        return handleApplyBorderStyleTool(currentState, action, tool);
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
