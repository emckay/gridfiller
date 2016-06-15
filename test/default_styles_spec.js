import { expect } from 'chai';

import defaults from '../src/defaults';
import constants from '../src/constants.json';

describe('defaults', () => {
    describe('cellWidth()', () => {
        it('returns value from json file', () => {
            expect(defaults.cellWidth()).to.eq(constants['cell-width']);
        });
    });

    describe('contentLeft()', () => {
        it('works for first col', () => {
            expect(defaults.contentLeft(0)).to.eq(0);
        });

        it('words for second col', () => {
            expect(defaults.contentLeft(1)).to.eq(constants['cell-width'] / 3);
        });

        it('works with string target', () => {
            expect(defaults.contentLeft('1')).to.eq(constants['cell-width'] / 3);
        });
    });
});
