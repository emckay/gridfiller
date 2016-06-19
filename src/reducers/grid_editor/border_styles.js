import { insert } from './index';
import immutable from 'seamless-immutable';
import get from 'lodash/get';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';

import defaults from '../../defaults';

const adjacentCells = (row, col) => ({
    above: [row - 1, col],
    left: [row, col - 1],
    clicked: [row, col],
    below: [row + 1, col],
    right: [row, col + 1],
});

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

const idToBorderName = (borderId) => {
    switch (borderId) {
        case 0: return 'borderTop';
        case 1: return 'borderRight';
        case 2: return 'borderBottom';
        case 3: return 'borderLeft';
        default: throw new Error(`Unknown borderId ${borderId}`);
    }
};

const sharedToFull = (targetBorderId, sharedStyle) => {
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

const styleDeltas = (targetBorderId, widthDelta, neighbor) => {
    const scaledWidth = widthDelta / (neighbor + 1);
    const halfWidth = widthDelta / 2;

    let deltas;
    if (targetBorderId === 0 || targetBorderId === 3) {
        deltas = {
            width: scaledWidth,
            margin: (neighbor ? 0 : -halfWidth),
            dim: (neighbor ? -scaledWidth : -halfWidth),
        };
    } else {
        deltas = {
            width: scaledWidth,
            margin: 0,
            dim: -halfWidth,
        };
    }

    return mapKeys(deltas, (v, k) => sharedToFull(targetBorderId, k));
};

export const handleApplyBorderWidthTool = (currentState, action, tool) => {
    const cells = currentState.grid.present.cells;

    const cellsToChange = targetCells(
        action.row,
        action.col,
        cells.length - 1,
        cells[action.row].length - 1,
        action.target
    );

    let newGrid = currentState.grid.present;

    const neighbor = cellsToChange.length > 1;
    const widthDelta = get(tool, ['style', 'width']);

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const origStyles = get(cells, [...c, 'style']);

        // flip target border for neighboring cell (if top clicked, change bottom of above cell)
        const target = (action.target + i * 2) % 4;

        // calculate new styles as delta + current (or default) value
        const deltas = styleDeltas(target, widthDelta, neighbor);
        const newStyles = mapValues(deltas, (v, k) => {
            let origOrDefault = origStyles[k];
            if (origOrDefault === undefined) {
                origOrDefault = defaults[k](neighbor, c[0]);
            }

            return v + origOrDefault;
        });

        // don't change anything if new width will be negative
        if (newStyles[`${idToBorderName(action.target)}Width`] < 0) {
            return currentState;
        }

        // merge each new style into the grid
        for (const style of Object.keys(newStyles)) {
            newGrid = newGrid.setIn(['cells', ...c, 'style', style], newStyles[style]);
        }
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export const handleApplyBorderStyleTool = (currentState, action, tool) => {
    let newGrid = currentState.grid.present;
    const cells = newGrid.cells;

    if (tool.style.style === undefined) {
        return currentState;
    }

    const cellsToChange = targetCells(
        action.row,
        action.col,
        cells.length - 1,
        cells[action.row].length - 1,
        action.target
    );

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const target = (action.target + i * 2) % 4;
        const targetBorderStyle = `${idToBorderName(target)}Style`;
        const origStyles = get(cells, [...c, 'style']);

        let currentBorderStyle = origStyles[targetBorderStyle];
        if (currentBorderStyle === undefined) {
            currentBorderStyle = defaults.borderStyle();
        }

        const styleInd = ['cells', ...c, 'style', targetBorderStyle];
        if (currentBorderStyle === tool.style.style[0]) {
            newGrid = newGrid.setIn(styleInd, tool.style.style[1]);
        } else {
            newGrid = newGrid.setIn(styleInd, tool.style.style[0]);
        }
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export const handleResetSingleBorderTool = (currentState, action) => {
    let newGrid = currentState.grid.present;
    const cells = newGrid.cells;

    const cellsToChange = targetCells(
        action.row,
        action.col,
        cells.length - 1,
        cells[action.row].length - 1,
        action.target
    );

    const neighbor = cellsToChange.length > 1;

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const target = (action.target + i * 2) % 4;
        const targetBorderWidth = `${idToBorderName(target)}Width`;
        const origStyles = get(cells, [...c, 'style']);

        // if no current styles, do nothing
        if (origStyles === undefined) return currentState;

        const defaultWidth = defaults[targetBorderWidth](neighbor);

        const currentWidth = get(cells, [...c, 'style', targetBorderWidth]);

        // total widthDelta for both this change and neighbor' change
        const widthDelta = (defaultWidth - currentWidth) * 2;

        // do nothing if this width hasn't been set or it is already the default
        if (currentWidth === undefined || widthDelta === 0) {
            return currentState;
        }

        const deltas = styleDeltas(target, widthDelta, neighbor);

        const newStyles = mapValues(deltas, (v, k) => {
            let origOrDefault = origStyles[k];
            if (origOrDefault === undefined) {
                origOrDefault = defaults[k](neighbor, c[0]);
            }

            return v + origOrDefault;
        });

        // merge each new style into the grid
        for (const style of Object.keys(newStyles)) {
            newGrid = newGrid.setIn(['cells', ...c, 'style', style], newStyles[style]);
        }
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
};
