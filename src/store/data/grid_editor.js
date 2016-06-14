import { fromJS } from 'immutable';

import { tenByTen } from './grids/initial_grids';
import initialTools from './tools/initial_tools';

export default fromJS({
    grid: {
        cells: tenByTen,
    },
    tools: {
        availableTools: initialTools,
        sharedOptions: {
            primaryColor: '#ffff00',
            secondaryColor: '#ff00ff',
        },
    },
});
