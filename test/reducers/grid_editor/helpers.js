import { expect } from 'chai';
import get from 'lodash/get';

export const cellInd = (row, col, gridId = 'main') => {
    if (gridId === 'main') {
        return ['grid', 'present', 'cells', row, col];
    }
    return ['grid', 'present', 'gallery', gridId, row, col];
};

export const cellStyleInd = (...cell) =>
    [...cellInd(...cell), 'style'];

export const changeStyle = (state, cell, style, value) =>
    state.setIn([...cellStyleInd(...cell), style], value);

export const expectStyle = (state, cell, style, value) =>
    expect(get(state, [...cellStyleInd(...cell), style])).to.eq(value);

export const cellContentInd = (cell, contentId) =>
    [...cellInd(...cell), 'content', contentId];

export const changeContentText = (state, cell, contentId, value) =>
    state.setIn([...cellContentInd(cell, contentId), 'text'], value);

export const expectContentText = (state, cell, contentId, value) =>
    expect(get(state, [...cellContentInd(cell, contentId), 'text'])).to.eq(value);

export const contentStyleInd = (cell, contentId, style) =>
    [...cellInd(...cell), 'content', contentId, 'style', style];

export const getContentStyle = (state, cell, contentId, style) =>
    get(state, contentStyleInd(cell, contentId, style));

export const expectContentStyle = (state, cell, contentId, style, value) =>
    expect(getContentStyle(state, cell, contentId, style)).to.eq(value);

export const getGalleryCell = (state, gridId) =>
    get(state, ['grid', 'present', 'gallery', gridId, 0, 0]);
