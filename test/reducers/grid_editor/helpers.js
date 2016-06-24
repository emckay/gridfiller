import { expect } from 'chai';
import get from 'lodash/get';

export const cellInd = (row, col) =>
    ['grid', 'present', 'cells', row, col];

export const cellStyleInd = (row, col) =>
    [...cellInd(row, col), 'style'];

export const changeStyle = (state, cell, style, value) =>
    state.setIn([...cellStyleInd(...cell), style], value);

export const expectStyle = (state, cell, style, value) =>
    expect(get(state, [...cellStyleInd(...cell), style])).to.eq(value);

export const cellContentInd = (row, col, contentId) =>
    [...cellInd(row, col), 'content', contentId];

export const changeContentText = (state, cell, contentId, value) =>
    state.setIn([...cellContentInd(...cell, contentId), 'text'], value);

export const expectContentText = (state, cell, contentId, value) =>
    expect(get(state, [...cellContentInd(...cell, contentId), 'text'])).to.eq(value);

export const stateToCell = (state, cell) => (
    get(state, cellInd(...cell))
);

export const stateToContentStyle = (state, cell, contentId, style) => (
    get(stateToCell(state, cell),
        ['content', contentId, 'style', style]
    )
);
