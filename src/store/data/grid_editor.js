import immutable from 'seamless-immutable';

import { twelveByTwelve } from './grids/initial_grids';
import { sideTools, topTools } from './tools/initial_tools';

export default immutable({
    grid: {
        cells: twelveByTwelve,
        checkpoint: twelveByTwelve,
    },
    tools: {
        sideTools,
        topTools,
        sharedOptions: {
            primaryColor: '#ffff00',
            secondaryColor: '#ff00ff',
        },
    },
});
