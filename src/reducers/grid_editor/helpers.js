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

export const insertCellsInHistory = (currentState, cells) => {
    const newGrid = currentState.grid.present.set('cells', cells);
    return currentState.set('grid', insert(currentState.grid, newGrid));
};

export const runAndInsert = (fn) => (currentState, ...args) => {
    const cells = currentState.grid.present.cells;
    const newCells = fn(cells, ...args);
    return insertCellsInHistory(currentState, newCells);
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