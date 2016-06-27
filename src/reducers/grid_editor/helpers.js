import get from 'lodash/get';

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

export const gridInd = (gridId) => {
    const targetGrid = ['grid', 'present'];
    if (typeof gridId === 'number') {
        targetGrid.push('gallery');
        targetGrid.push(gridId);
    } else {
        targetGrid.push('cells');
    }
    return targetGrid;
};

export const activeGrid = (currentState, gridId) =>
    get(currentState, gridInd(gridId));

export const insertCellsInHistory = (currentState, targetGrid, cells) => {
    const newGrid = currentState.setIn(targetGrid, cells).grid.present;
    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export const runAndInsert = (fn) => (currentState, gridId, ...args) => {
    const targetGrid = gridInd(gridId);
    const cells = get(currentState, targetGrid);
    const newCells = fn(cells, ...args);
    return insertCellsInHistory(currentState, targetGrid, newCells);
};

export const fillSharedOptions = (dynamicTool, sharedOptions) => {
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

export const adjacentCells = (row, col) => ({
    above: [row - 1, col],
    left: [row, col - 1],
    clicked: [row, col],
    below: [row + 1, col],
    right: [row, col + 1],
});

export const hasNeighbor = (cells, { row, col, target }) =>
    (target === 0 && row > 0) ||
    (target === 1 && row < cells.length - 1) ||
    (target === 2 && col < cells[row].length - 1) ||
    (target === 3 && col > 0);

export const targetCells = (row, col, lastRow, lastCol, targetBorderId) => {
    const adj = adjacentCells(row, col);
    const targets = [adj.clicked];

    if (targetBorderId === 0 && row > 0) {
        targets.push(adj.above);
    } else if (targetBorderId === 1 && col < lastCol) {
        targets.push(adj.right);
    } else if (targetBorderId === 2 && row < lastRow) {
        targets.push(adj.below);
    } else if (targetBorderId === 3 && col > 0) {
        targets.push(adj.left);
    }

    return targets;
};

export const idToBorderName = (borderId) => {
    switch (borderId) {
        case 0: return 'borderTop';
        case 1: return 'borderRight';
        case 2: return 'borderBottom';
        case 3: return 'borderLeft';
        default: throw new Error(`Unknown borderId ${borderId}`);
    }
};

export const sharedToFull = (targetBorderId, sharedStyle) => {
    const targetBorderName = idToBorderName(targetBorderId);

    if (targetBorderId === 0 || targetBorderId === 2) {
        switch (sharedStyle) {
            case 'width': return `${targetBorderName}Width`;
            case 'margin': return 'marginTop';
            case 'dim': return 'height';
            default: throw new Error(`Unknown style ${sharedStyle}`);
        }
    } else if (targetBorderId === 1 || targetBorderId === 3) {
        switch (sharedStyle) {
            case 'width': return `${targetBorderName}Width`;
            case 'margin': return 'marginLeft';
            case 'dim': return 'width';
            default: throw new Error(`Unknown style ${sharedStyle}`);
        }
    }
    throw new Error(`Unknown targetBorderId ${targetBorderId}`);
};
