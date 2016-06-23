import immutable from 'seamless-immutable';

import { loadCells } from '../utils/state_loader';

const handleSetStyle = (currentState, action) =>
    currentState.setIn(['cells', action.row, action.col, 'style'], immutable(action.style));

const handleImportGrid = (currentState, action) =>
    currentState.set('cells', loadCells(action.compressedGrid));

const handleCreateResetCheckpoint = (currentState) =>
    currentState.set('checkpoint', currentState.cells);

const handleResetToCheckpoint = (currentState) =>
    currentState.set('cells', currentState.checkpoint);

export default function (currentState = immutable({}), action) {
    switch (action.type) {
        case 'SET_STYLE':
            return handleSetStyle(currentState, action);
        case 'IMPORT_GRID':
            return handleImportGrid(currentState, action);
        case 'CREATE_RESET_CHECKPOINT':
            return handleCreateResetCheckpoint(currentState);
        case 'RESET_TO_CHECKPOINT':
            return handleResetToCheckpoint(currentState);
        default:
            return currentState;
    }
}
