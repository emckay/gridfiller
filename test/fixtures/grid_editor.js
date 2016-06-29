import immutable from 'seamless-immutable';

import initialGridEditor from '../../src/store/data/grid_editor';
import { tenByTen } from '../../src/store/data/grids/initial_grids';
import tools from './tools';

const setActiveTool = (gridEditor, tool = tools.staticTool, mode = 'cell') => immutable(
    gridEditor.merge({ tools: { activeStyleTool: tool, mode } })
);

const setActiveContent = (gridEditor, activeContent) =>
    gridEditor.set('activeCellContent', immutable(activeContent));

const setSharedOptions = (gridEditor, sharedOption) => immutable(
    gridEditor.setIn(
        ['tools', 'sharedOptions', sharedOption.option],
        sharedOption.val
    )
);

const setCopiedCell = (gridEditor, copiedCellInd) =>
    gridEditor.set('copiedCell', copiedCellInd);

const addUndoHistoryToGrid = (gridEditor) => {
    const oldGrid = gridEditor.grid;
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
    withActiveContentId: (row = 1, col = 2, contentId = '3', gridId = 'main') =>
        setMode(setActiveContent(ge, { row, col, contentId, gridId }), 'Text'),
    withContentStyleTool: setSharedOptions(
        setActiveTool(ge, tools.contentFillTool(false)),
        { option: 'primaryColor', val: 'red' }
    ),
    withMiniContentStyleTool: setSharedOptions(
        setActiveTool(ge, tools.contentFillTool(true)),
        { option: 'primaryColor', val: 'red' }
    ),
    withContentBoldTool: setActiveTool(ge, tools.contentBoldTool(false)),
    withMiniContentUpTool: setActiveTool(ge, tools.contentUpTool(true)),
    withMainContentUpTool: setActiveTool(ge, tools.contentUpTool(false)),
    withMainContentRightTool: setActiveTool(ge, tools.contentRightTool(false)),
    withFontIncreaseTool: setActiveTool(ge, tools.increaseFontSize(false)),
    withMiniFontDecreaseTool: setActiveTool(ge, tools.decreaseFontSize(true)),
    withClearContentTool: setActiveTool(ge, tools.clearContentTool),
    withClearBorderTool: setActiveTool(ge, tools.clearBorderTool),
    withClearAllTool: setActiveTool(ge, tools.clearAllTool),
    withResetSingleBorderTool: setActiveTool(ge, tools.resetSingleBorderTool),
    withResetAllBordersTool: setActiveTool(ge, tools.resetAllBordersTool),
    withCopyTool: setActiveTool(ge, tools.copyTool),
    withPasteTool: (copiedCellInd) =>
        setCopiedCell(setActiveTool(ge, tools.pasteTool), copiedCellInd),
};
