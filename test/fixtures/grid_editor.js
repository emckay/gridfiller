import { fromJS, Map } from 'immutable';

import initialGridEditor from '../../src/store/data/grid_editor';
import { tenByTen } from '../../src/store/data/grids/initial_grids';
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

const tenByTenEditor = initialGridEditor.setIn(['grid', 'cells'], tenByTen);
const ge = addUndoHistoryToGrid(setMode(tenByTenEditor));

export default {
    withoutActiveTool: ge,
    withActiveTool: setActiveTool(ge),
    withDynamicTool: setSharedOptions(
        setActiveTool(ge, tools.dynamicTool),
        { option: 'primaryColor', val: 'red' }
    ),
    withStaticTool: setActiveTool(ge, tools.staticTool),
    withBorderStyleTool: setActiveTool(ge, tools.toggleSolidDashedTool),
    withBorderWidthTool: (width = 2) =>
        setActiveTool(ge, tools.changeBorderWidthTool(width), 'Border'),
    withActiveContentId: (row = 1, col = 2, contentId = '3') =>
        setMode(setActiveContent(ge, { row, col, contentId }), 'Text'),
    withContentStyleTool: setSharedOptions(
        setActiveTool(ge, tools.contentFillTool(false)),
        { option: 'primaryColor', val: 'red' }
    ),
    withMiniContentStyleTool: setSharedOptions(
        setActiveTool(ge, tools.contentFillTool(true)),
        { option: 'primaryColor', val: 'red' }
    ),
};
