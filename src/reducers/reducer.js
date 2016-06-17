import { combineReducers } from 'redux-seamless-immutable';

import gridEditor from './grid_editor/';
import { reducer as form } from 'redux-form';

export default combineReducers({
    gridEditor,
    form,
});
