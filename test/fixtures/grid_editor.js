import { fromJS, Map } from 'immutable';

import initialGridEditor from '../../src/store/data/grid_editor';
import tools from './tools';

const setActiveTool = (gridEditor, tool = tools.staticTool, mode = 'Cell') => fromJS(
    gridEditor.merge({ tools: { activeStyleTool: tool, mode } })
);

const setActiveContent = (gridEditor, { row, col, contentId }) =>
    gridEditor.setIn(['tools', 'activeCellContent'], new Map({ row, col, contentId }));

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

const setMode = (gridEditor, mode = 'cell') => gridEditor.set('mode', mode);

const ge = addUndoHistoryToGrid(setMode(initialGridEditor));

export default {
    withoutActiveTool: ge,
    withActiveTool: setActiveTool(ge),
    withDynamicTool: setSharedOptions(
        setActiveTool(ge, tools.dynamicTool),
        { option: 'primary-color', val: 'red' }
    ),
    withStaticTool: setActiveTool(ge, tools.staticTool),
    withBorderWidthTool: (width = 2) =>
        setActiveTool(ge, tools.increaseBorderWidthTool(width), 'Border'),
    withActiveContentId: (row = 1, col = 2, contentId = '3') =>
        setMode(setActiveContent(ge, { row, col, contentId }), 'Text'),
};
