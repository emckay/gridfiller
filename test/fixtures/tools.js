import { fromJS } from 'immutable';

import toolGroups from '../../src/store/data/tools/initial_tools';

export const dynamicTool = fromJS({
    name: 'Fill Cell',
    style: {
        backgroundColor: (sharedOptions) => sharedOptions.get('primary-color'),
    },
    icon: 'square',
});

export const staticTool = fromJS({
    name: 'Fill Red',
    style: { backgroundColor: 'red' },
    icon: 'square',
});

export const toolGroup = toolGroups.get(0);
