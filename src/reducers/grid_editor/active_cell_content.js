import immutable from 'seamless-immutable';

export const handleToggleActiveCellContent = (currentState, { row, col, contentId }) => {
    const currentActive = currentState.activeCellContent;
    let different = false;

    if (currentActive !== undefined) {
        if (row !== currentActive.row) different = true;
        if (col !== currentActive.col) different = true;
        if (contentId !== currentActive.contentId) different = true;
    }

    if (currentActive === undefined || different) {
        return currentState.set('activeCellContent', immutable({ row, col, contentId }));
    }

    return currentState.set('activeCellContent', undefined);
};

const moveCell = (direction, r, c) => {
    let [row, col] = [r, c];

    if (direction === 0) row -= 1;
    else if (direction === 1) col += 1;
    else if (direction === 2) row += 1;
    else if (direction === 3) col -= 1;
    else throw new Error(`Unknown direction ${direction}`);

    return { row, col };
};

const moveMini = (direction, c, movedCells) => {
    let current = c;

    if (movedCells === false) {
        if (direction === 0) current -= 3;
        else if (direction === 1) current += 1;
        else if (direction === 2) current += 3;
        else if (direction === 3) current -= 1;
        else throw new Error(`Unknown direction ${direction}`);
    } else {
        if (direction === 0) current += 6;
        else if (direction === 1) current -= 2;
        else if (direction === 2) current -= 6;
        else if (direction === 3) current += 2;
        else throw new Error(`Unknown direction ${direction}`);
    }

    return current;
};

const onEdge = (direction, contentId) =>
    (direction === 0 && contentId < 3) ||
    (direction === 1 && contentId % 3 === 2) ||
    (direction === 2 && contentId > 5) ||
    (direction === 3 && contentId % 3 === 0);

export const handleMoveActiveCellContent = (currentState, { direction }) => {
    if (currentState.activeCellContent === undefined) return currentState;

    let { row, col, contentId } = currentState.activeCellContent;

    const idInt = parseInt(contentId, 10);
    let jumpedCell = false;

    if (currentState.activeCellContent.contentId === 'main' || onEdge(direction, idInt)) {
        ({ row, col } = moveCell(direction, row, col));
        jumpedCell = true;
    }

    if (currentState.activeCellContent.contentId.match(/\d+/)) {
        contentId = moveMini(direction, idInt, jumpedCell).toString();
    }

    const numRows = currentState.grid.present.cells.length;

    if (row < 0) row = numRows + row;
    else if (row >= numRows) row = row % numRows;

    const numCols = currentState.grid.present.cells[row].length;
    if (col < 0) col = numCols + col;
    else if (col >= numCols) col = col % numCols;

    return currentState.set('activeCellContent', immutable({ row, col, contentId }));
};
