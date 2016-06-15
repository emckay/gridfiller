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

const targetCellsAndBorders = (row, col, lastRow, lastCol, targetBorder, borderStyle, hStyles=[], vStyles=[]) => {
    const adj = adjacentCells(row, col);
    const targetCells = [adj.clicked];
    const targetStyles = [];

    if (targetBorder === 0) {
        targetStyles.push([`borderTop${borderStyle}`, ...vStyles]);
        if (row > 0) {
            targetCells.push(adj.above);
            targetStyles.push([`borderBottom${borderStyle}`, ...vStyles]);
        }
    } else if (targetBorder === 1) {
        targetStyles.push([`borderRight${borderStyle}`, ...hStyles]);
        if (col < lastCol) {
            targetCells.push(adj.right);
            targetStyles.push([`borderLeft${borderStyle}`, ...hStyles]);
        }
    } else if (targetBorder === 2) {
        if (row < lastRow) {
            targetStyles.push([`borderBottom${borderStyle}`, ...vStyles]);
            targetCells.push(adj.below);
            targetStyles.push([`borderTop${borderStyle}`, ...vStyles]);
        } else {
            targetStyles.push([`borderBottom${borderStyle}`, ...vStyles]);
        }
    } else if (targetBorder === 3) {
        targetStyles.push([`borderLeft${borderStyle}`, ...hStyles]);
        if (col > 0) {
            targetCells.push(adj.left);
            targetStyles.push([`borderRight${borderStyle}`, ...hStyles]);
        }
    }

    return { targetCells, targetStyles };
};

const handleApplyBorderWidthTool = (currentState, action, tool) => {
    const cells = currentState.get('grid').present.get('cells');

    const vStyles = ['marginTop', 'height'];
    const hStyles = ['marginLeft', 'width'];

    const { targetCells, targetStyles } =
        targetCellsAndBorders(
            action.row,
            action.col,
            cells.size - 1,
            cells.get(action.row).size - 1,
            action.target,
            'Width',
            hStyles,
            vStyles
        );

    const neighbor = targetCells.length > 1;

    const width = tool.getIn(['style', 'width']);
    const scaledWidth = width / targetCells.length;
    const halfWidth = width / 2;

    const styleObjs = [];

    for (let i = 0; i < targetStyles.length; i++) {
        const arr = targetStyles[i];
        const targetBorder = arr[0];
        const origStyle = cells.getIn([...targetCells[i].pos, 'style']);

        let origBorder = origStyle.get(targetStyles[i][0]);
        if (origBorder === undefined) origBorder = (neighbor ? 1 : 2);

        let defaultMargin = 0;
        if (targetCells[i].pos[0] === 0 &&
            (targetBorder === 'borderTopWidth' || targetBorder === 'borderBottomWidth')
        ) {
            defaultMargin = -1;
        }
        const origMargin = origStyle.get(targetStyles[i][1]) || defaultMargin;
        const origDim = origStyle.get(targetStyles[i][2]) || 60;

        let amounts;
        if (targetBorder === 'borderTopWidth' || targetBorder === 'borderLeftWidth') {
            amounts = [
                origBorder + scaledWidth,
                origMargin - (neighbor ? 0 : halfWidth),
                origDim - (neighbor ? scaledWidth : halfWidth),
            ];
        } else {
            amounts = [
                origBorder + scaledWidth,
                origMargin,
                origDim - halfWidth,
            ];
        }

        if (width < 0 && amounts[0] < 0) {
            amounts = [origBorder, origMargin, origDim];
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

const handleApplyBorderStyleTool = (currentState, action, tool) => {
    const cells = currentState.get('grid').present.get('cells');

    const { targetCells, targetStyles } =
        targetCellsAndBorders(
            action.row,
            action.col,
            cells.size - 1,
            cells.get(action.row).size - 1,
            action.target,
            'Style'
        );

    let newGrid = currentState.get('grid').present;

    for (let i = 0; i < targetCells.length; i++) {
        const currentBorderStyle = cells.getIn(
            [...targetCells[i].pos, 'style', targetStyles[i][0]]
        ) || 'solid';
        const styles = tool.getIn(['style', 'style']).map((el) => el);
        const styleInd = ['cells', ...targetCells[i].pos, 'style', targetStyles[i][0]];
        if (currentBorderStyle === styles.get(0)) {
            newGrid = newGrid.setIn(styleInd, styles.get(1));
        } else {
            newGrid = newGrid.setIn(styleInd, styles.get(0));
        }
    }

    return currentState.set('grid', insert(currentState.get('grid'), newGrid));
};

const handleApplyContentStyleTool = (currentState, action, tool) => {
    const presentGrid = currentState.get('grid').present;
    const filledTool = fillSharedOptions(tool, currentState.getIn(['tools', 'sharedOptions']));
    const newGrid = presentGrid.mergeIn(
        ['cells', action.row, action.col, 'content', action.target, 'style'],
        filledTool.get('style')
    );

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
