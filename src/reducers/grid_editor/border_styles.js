import { insert } from './index';
import immutable from 'seamless-immutable';
import get from 'lodash/get';

const adjacentCells = (row, col) => ({
    above: { pos: [row - 1, col] },
    left: { pos: [row, col - 1] },
    clicked: { pos: [row, col] },
    below: { pos: [row + 1, col] },
    right: { pos: [row, col + 1] },
});

export const targetCellsAndBorders = (row, col, lastRow, lastCol, targetBorder, borderStyle, hStyles = [], vStyles = []) => {
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

export const handleApplyBorderWidthTool = (currentState, action, tool) => {
    const cells = currentState.grid.present.cells;

    const vStyles = ['marginTop', 'height'];
    const hStyles = ['marginLeft', 'width'];

    const { targetCells, targetStyles } =
        targetCellsAndBorders(
            action.row,
            action.col,
            cells.length - 1,
            cells[action.row].length - 1,
            action.target,
            'Width',
            hStyles,
            vStyles
        );

    const neighbor = targetCells.length > 1;

    const width = get(tool, ['style', 'width']);
    const scaledWidth = width / targetCells.length;
    const halfWidth = width / 2;

    const styleObjs = [];

    for (let i = 0; i < targetStyles.length; i++) {
        const arr = targetStyles[i];
        const targetBorder = arr[0];
        const origStyle = get(cells, [...targetCells[i].pos, 'style']);

        let origBorder = origStyle[targetStyles[i][0]];
        if (origBorder === undefined) origBorder = (neighbor ? 1 : 2);

        let defaultMargin = 0;
        if (targetCells[i].pos[0] === 0 &&
            (targetBorder === 'borderTopWidth' || targetBorder === 'borderBottomWidth')
        ) {
            defaultMargin = -1;
        }
        const origMargin = origStyle[targetStyles[i][1]] || defaultMargin;
        const origDim = origStyle[targetStyles[i][2]] || 60;

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

    let newGrid = currentState.grid.present;
    targetCells.forEach((c, i) => {
        for (const style of Object.keys(styleObjs[i])) {
            newGrid = newGrid.setIn(['cells', ...c.pos, 'style', style], styleObjs[i][style]);
        }
    });

    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export const handleApplyBorderStyleTool = (currentState, action, tool) => {
    const cells = currentState.grid.present.cells;

    const { targetCells, targetStyles } =
        targetCellsAndBorders(
            action.row,
            action.col,
            cells.length - 1,
            cells[action.row].length - 1,
            action.target,
            'Style'
        );

    let newGrid = currentState.grid.present;

    for (let i = 0; i < targetCells.length; i++) {
        const currentBorderStyle = get(
            cells,
            [...targetCells[i].pos, 'style', targetStyles[i][0]],
            'solid'
        );
        const styles = get(tool, ['style', 'style']).map((el) => el);
        const styleInd = ['cells', ...targetCells[i].pos, 'style', targetStyles[i][0]];
        if (currentBorderStyle === styles[0]) {
            newGrid = newGrid.setIn(styleInd, styles[1]);
        } else {
            newGrid = newGrid.setIn(styleInd, styles[0]);
        }
    }

    return currentState.set('grid', insert(currentState.grid, newGrid));
};
