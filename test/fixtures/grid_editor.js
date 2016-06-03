
import initialGridEditor from '../../src/store/data/grid_editor';
import initialTools from '../../src/store/data/tools/initial_tools';

export const gridEditorWithoutActiveTool = initialGridEditor;

export const gridEditorWithActiveTool = initialGridEditor.setIn(
    ['tools', 'activeStyleTool'],
    initialTools.get(0)
);
