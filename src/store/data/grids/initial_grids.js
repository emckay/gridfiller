import { fromJS } from 'immutable';

import { emptyCell } from './empty_cell';


const createSquareGrid = (n) => {
    const grid = [];

    for (let i = 0; i < n; i++) {
        grid.push([]);
        for (let j = 0; j < n; j++) {
            grid[grid.length - 1].push(emptyCell());
        }
    }
    return fromJS(grid);
};

export const tenByTen = createSquareGrid(10);
export const twelveByTwelve = createSquareGrid(12);
export const threeByThree = createSquareGrid(3);

export default [
    fromJS({
        name: '10x10',
        cells: tenByTen,
    }),
];
