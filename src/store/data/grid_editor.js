import immutable from 'seamless-immutable';

import { twelveByTwelve } from './grids/initial_grids';
import { sideTools, topTools } from './tools/initial_tools';
import { emptyCell } from './grids/empty_cell';

const blankCells = [];

for (let i = 0; i < 9; i++) {
    blankCells.push([[emptyCell()]]);
}

export default immutable({
    grid: {
        cells: twelveByTwelve,
        checkpoint: twelveByTwelve,
        gallery: blankCells,
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
