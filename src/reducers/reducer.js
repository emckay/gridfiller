import { combineReducers } from 'redux';

import gridEditor from './grid_editor/';
import { reducer as form } from 'redux-form';

export default combineReducers({
    gridEditor,
    form,
});
