import { combineReducers } from 'redux';
import undoable, { combineFilters, excludeAction } from 'redux-undo';

import gridEditor from './grid_editor';

const filterGridChanges = (action, currentState) => (
    action.type === 'APPLY_ACTIVE_STYLE_TOOL' &&
        !currentState.getIn(['tools', 'activeStyleTool'])
);

export default combineReducers({
    gridEditor: undoable(gridEditor, {
        filter: combineFilters(
            excludeAction([
                'SWAP_COLORS',
                'TOGGLE_ACTIVE_STYLE_TOOL',
            ]),
            filterGridChanges),
    }),
});
