import get from 'lodash/get';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';

import defaults from '../../defaults';

import {
    hasNeighbor,
    targetCells,
    idToBorderName,
    sharedToFull,
    runAndInsert,
 } from './helpers';

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

export const changeBorderWidth = (startingCells, { row, col, target, widthDelta }) => {
    let cells = startingCells;

    const cellsToChange = targetCells(
        row,
        col,
        cells.length - 1,
        cells[row].length - 1,
        target
    );

    const neighbor = cellsToChange.length > 1;

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const origStyles = get(startingCells, [...c, 'style']);

        // flip target border for neighboring cell (if top clicked, change bottom of above cell)
        const thisTarget = (target + i * 2) % 4;

        // calculate new styles as delta + current (or default) value
        const deltas = styleDeltas(thisTarget, widthDelta, neighbor);
        const newStyles = mapValues(deltas, (v, k) => {
            let origOrDefault = origStyles[k];
            if (origOrDefault === undefined) {
                origOrDefault = defaults[k](neighbor, c[0]);
            }

            return v + origOrDefault;
        });

        // don't change anything if new width will be negative
        if (newStyles[`${idToBorderName(target)}Width`] < 0) {
            return startingCells;
        }

        // merge each new style into the grid
        for (const style of Object.keys(newStyles)) {
            cells = cells.setIn([...c, 'style', style], newStyles[style]);
        }
    }

    return cells;
};

export const insertChangeBorderWidth = runAndInsert(changeBorderWidth);

export const toggleBorderStyle = (cells, { row, col, target }, styles) => {
    if (styles === undefined) {
        return cells;
    }

    const cellsToChange = targetCells(
        row,
        col,
        cells.length - 1,
        cells[row].length - 1,
        target
    );

    let newCells = cells;

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const thisTarget = (target + i * 2) % 4;
        const targetBorderStyle = `${idToBorderName(thisTarget)}Style`;
        const origStyles = get(cells, [...c, 'style']);

        let currentBorderStyle = origStyles[targetBorderStyle];
        if (currentBorderStyle === undefined) {
            currentBorderStyle = defaults.borderStyle();
        }

        const styleInd = [...c, 'style', targetBorderStyle];
        if (currentBorderStyle === styles[0]) {
            newCells = newCells.setIn(styleInd, styles[1]);
        } else {
            newCells = newCells.setIn(styleInd, styles[0]);
        }
    }

    return newCells;
};

export const insertToggleBorderStyle = runAndInsert(toggleBorderStyle);

export const clearBorderWidth = (origCells, { row, col, target }) => {
    const cells = origCells;

    // check if the border has a neighbor (matters for default and delta)
    const neighbor = hasNeighbor(cells, { row, col, target });

    const targetName = `${idToBorderName(target)}Width`;

    const currentWidth = get(cells, [row, col, 'style', targetName]);
    const defaultWidth = defaults[targetName](neighbor);

    // if there is no current width or the current width is the default, then we're done
    if (currentWidth === undefined || currentWidth === defaultWidth) {
        return origCells;
    }

    // total widthDelta for both this change and neighbor's change
    let widthDelta = defaultWidth - currentWidth;
    if (neighbor) widthDelta *= 2;

    return changeBorderWidth(cells, { row, col, target, widthDelta });
};

export const clearBorderStyle = (startingCells, { row, col, target }) => {
    let cells = startingCells;

    const cellsToChange = targetCells(
        row,
        col,
        cells.length - 1,
        cells[row].length - 1,
        target
    );

    for (let i = 0; i < cellsToChange.length; i++) {
        const c = cellsToChange[i];
        const origStyles = get(startingCells, [...c, 'style']);

        // flip target border for neighboring cell (if top clicked, change bottom of above cell)
        const thisTarget = (target + i * 2) % 4;

        const targetName = `${idToBorderName(thisTarget)}Style`;

        if (origStyles === undefined || origStyles[targetName] === undefined) {
            continue;
        }

        cells = cells.setIn([...c, 'style', targetName], defaults[targetName]());
    }

    return cells;
};

export const applyToAll = (origCells, action, func) => {
    let cells = origCells;
    for (let target = 0; target < 4; target++) {
        cells = func(cells, { ...action, target });
    }
    return cells;
};

export const clearAllBorderWidths = (currentState, action) =>
    applyToAll(currentState, action, clearBorderWidth);

export const clearAllBorderStyles = (currentState, action) =>
    applyToAll(currentState, action, clearBorderStyle);

export const clearAllBorders = (origCells, action) => {
    let cells = origCells;
    cells = clearAllBorderWidths(cells, action);
    cells = clearAllBorderStyles(cells, action);
    return cells;
};
