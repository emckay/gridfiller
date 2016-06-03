import { fromJS } from 'immutable';

import initialGridEditor from '../../src/store/data/grid_editor';
import * as tools from './tools';

const setActiveTool = (gridEditor, tool = tools.staticTool) => {
    return fromJS(gridEditor.setIn(['tools', 'activeStyleTool'], tool));
};

const setSharedOptions = (gridEditor, sharedOption) => {
    return fromJS(gridEditor.setIn(
        ['tools', 'sharedOptions', sharedOption.option],
        sharedOption.val
    ));
};

const ge = initialGridEditor;

export default {
    withoutActiveTool: ge,
    withActiveTool: setActiveTool(ge),
    withDynamicTool: setSharedOptions(
        setActiveTool(ge, tools.dynamicTool),
        { option: 'primary-color', val: 'red' }
    ),
    withStaticTool: setActiveTool(ge, tools.staticTool),
};
