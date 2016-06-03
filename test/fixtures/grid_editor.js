
import initialGridEditor from '../../src/store/data/grid_editor';
import initialTools from '../../src/store/data/tools/initial_tools';

export default {
    withoutActiveTool: initialGridEditor,
    withActiveTool: initialGridEditor.setIn(
        ['tools', 'activeStyleTool'],
        initialTools.get(0)
    ),
};
