import { fromJS } from 'immutable';
import cloner from 'cloner';

const cell = { content: '0', style: {} };

const grid = [];

for (let i = 0; i < 10; i++) {
    grid.push([]);
    for (let j = 0; j < 10; j++) {
        grid[grid.length - 1].push(cloner.deep.copy(cell));
    }
}

export const tenByTen = fromJS(grid);
