import { fromJS } from 'immutable';

import { tenByTen, twelveByTwelve } from './grids/initial_grids';
import initialTools from './tools/initial_tools';

export default fromJS({
    grid: {
        cells: twelveByTwelve,
    },
    tools: {
        availableTools: initialTools,
        sharedOptions: {
            primaryColor: '#ffff00',
            secondaryColor: '#ff00ff',
        },
    },
});
