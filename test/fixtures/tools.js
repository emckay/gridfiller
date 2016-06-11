import * as tools from '../../src/store/data/tools/initial_tools';

export default {
    ...tools,
    staticTool: tools.fillCellTool.setIn(['style', 'backgroundColor'], 'red'),
};
