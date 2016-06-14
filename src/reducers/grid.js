import { Map, fromJS } from 'immutable';

import { loadCells } from '../utils/state_loader';

const handleSetStyle = (currentState, action) => currentState.setIn(
    ['cells', action.row, action.col, 'style'],
    fromJS(action.style)
);

const handleImportGrid = (currentState, action) => currentState.set(
    'cells',
    loadCells(action.compressedGrid)
);

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'SET_STYLE':
            return handleSetStyle(currentState, action);
        case 'IMPORT_GRID':
            return handleImportGrid(currentState, action);
        default:
            return currentState;
    }
}
