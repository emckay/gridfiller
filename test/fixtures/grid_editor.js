import { fromJS } from 'immutable';

import initialGridEditor from '../../src/store/data/grid_editor';
import * as tools from './tools';

const setActiveTool = (gridEditor, tool = tools.staticTool, mode = 'Cell') => fromJS(
    gridEditor.merge({ tools: { activeStyleTool: tool, mode } })
);

const setSharedOptions = (gridEditor, sharedOption) => fromJS(
    gridEditor.setIn(
        ['tools', 'sharedOptions', sharedOption.option],
        sharedOption.val
    )
);

const addUndoHistoryToGrid = (gridEditor) => {
    const oldGrid = gridEditor.get('grid');
    return gridEditor.set('grid', { past: [], present: oldGrid, future: [] });
};

const ge = addUndoHistoryToGrid(initialGridEditor);

export default {
    withoutActiveTool: ge,
    withActiveTool: setActiveTool(ge),
    withDynamicTool: setSharedOptions(
        setActiveTool(ge, tools.dynamicTool),
        { option: 'primary-color', val: 'red' }
    ),
    withStaticTool: setActiveTool(ge, tools.staticTool),
    withBorderTool: setActiveTool(ge, tools.borderTool, 'Border'),
};
