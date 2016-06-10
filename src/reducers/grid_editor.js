import { combineReducers } from 'redux-immutable';
import undoable from 'redux-undo';
import { Map } from 'immutable';

import gridReducer from './grid';
import toolsReducer from './tools';

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
    const newGrid = presentGrid.mergeIn(
        ['cells', action.row, action.col, 'style'],
        filledTool.get('style')
    );
    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};


const adjacentCells = (row, col) => ({
    above: { pos: [row - 1, col] },
    left: { pos: [row, col - 1] },
    clicked: { pos: [row, col] },
    below: { pos: [row + 1, col] },
    right: { pos: [row, col + 1] },
});

const handleApplyBorderStyleTool = (currentState, action, tool) => {
    const cells = currentState.get('grid').present.get('cells');
    const lastRow = cells.size - 1;
    const lastCol = cells.get(0).size - 1;

    // find target cells
    const adj = adjacentCells(action.row, action.col);
    const targetCells = [adj.clicked];
    const targetStyles = [];
    let neighbor = false;
    if (action.target === 0) {
        targetStyles.push(['borderTopWidth', 'marginTop', 'height']);
        if (action.row > 0) {
            targetCells.push(adj.above);
            targetStyles.push(['borderBottomWidth', 'marginTop', 'height']);
            neighbor = true;
        }
    } else if (action.target === 1) {
        targetStyles.push(['borderRightWidth', 'marginLeft', 'width']);
        if (action.col < lastCol) {
            targetCells.push(adj.right);
            targetStyles.push(['borderLeftWidth', 'marginLeft', 'width']);
            neighbor = true;
        }
    } else if (action.target === 2) {
        if (action.row < lastRow) {
            targetStyles.push(['borderBottomWidth', 'marginTop', 'height']);
            targetCells.push(adj.below);
            targetStyles.push(['borderTopWidth', 'marginTop', 'height']);
            neighbor = true;
        } else {
            targetStyles.push(['borderBottomWidth', 'marginTop', 'height']);
        }
    } else if (action.target === 3) {
        targetStyles.push(['borderLeftWidth', 'marginLeft', 'width']);
        if (action.col > 0) {
            targetCells.push(adj.left);
            targetStyles.push(['borderRightWidth', 'marginLeft', 'width']);
            neighbor = true;
        }
    }

    const width = tool.getIn(['style', 'width']);
    const scaledWidth = width / targetCells.length;
    const halfWidth = width / 2;

    const styleObjs = [];

    for (let i = 0; i < targetStyles.length; i++) {
        const arr = targetStyles[i];
        const targetBorder = arr[0];
        const origStyle = cells.getIn([...targetCells[i].pos, 'style']);
        const origBorder = origStyle.get(targetStyles[i][0]) || (neighbor ? 1 : 2);
        let defaultMargin = 0;
        if (targetCells[i].pos[0] === 0 &&
            (targetBorder === 'borderTopWidth' || targetBorder === 'borderBottomWidth')
        ) {
            defaultMargin = -1;
        }
        const origMargin = origStyle.get(targetStyles[i][1]) || defaultMargin;
        const origDim = origStyle.get(targetStyles[i][2]) || 60;

        let amounts;
        if (targetBorder === 'borderTopWidth') {
            if (neighbor) {
                amounts = [
                    origBorder + scaledWidth,
                    origMargin,
                    origDim - scaledWidth,
                ];
            } else {
                amounts = [
                    origBorder + scaledWidth,
                    origMargin - halfWidth,
                    origDim - halfWidth,
                ];
            }
        } else if (targetBorder === 'borderLeftWidth') {
            if (neighbor) {
                amounts = [
                    origBorder + scaledWidth,
                    origMargin,
                    origDim - scaledWidth,
                ];
            } else {
                amounts = [
                    origBorder + scaledWidth,
                    origMargin - halfWidth,
                    origDim - halfWidth,
                ];
            }
        } else if (targetBorder === 'borderBottomWidth') {
            amounts = [
                origBorder + scaledWidth,
                origMargin,
                origDim - halfWidth,
            ];
        } else if (targetBorder === 'borderRightWidth') {
            amounts = [
                origBorder + scaledWidth,
                origMargin,
                origDim - halfWidth,
            ];
        }

        styleObjs.push({});
        let j = 0;
        for (const style of arr) {
            styleObjs[styleObjs.length - 1][style] = amounts[j];
            j++;
        }
    }

    let newGrid = currentState.get('grid').present;
    targetCells.forEach((c, i) => {
        newGrid = newGrid.mergeIn(['cells', ...c.pos, 'style'], styleObjs[i]);
    });

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

const handleUpdateCellContent = (currentState, { text }) => {
    const target = currentState.getIn(['tools', 'activeCellContent']);

    const currentGrid = currentState.get('grid').present;

    const newGrid = currentGrid.setIn([
        'cells',
        target.get('row'),
        target.get('col'),
        'content',
        target.get('contentId'),
    ], text);

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
