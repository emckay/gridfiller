import { expect } from 'chai';
import { fromJS } from 'immutable';

import * as actions from '../../src/actions/grid';
import reducer from '../../src/reducers/grid';

import initialGrids from '../../src/store/data/grids/initial_grids';

const tenByTen = initialGrids[0];

describe('grid reducer', () => {
    describe('SET_STYLE', () => {
        const initialState = fromJS({ cells: tenByTen });

        context('with immutable style', () => {
            const newStyle = fromJS({ backgroundColor: 'red' });
            const action = actions.setStyle(3, 2, newStyle);
            const nextState = reducer(initialState, action);
            it('sets style of cell', () => {
                expect(nextState.getIn(['cells', 3, 2, 'style'])).to
                    .eql(fromJS(newStyle));
            });
        });

        context('with object style', () => {
            const newStyle = { backgroundColor: 'red' };
            const action = actions.setStyle(3, 2, newStyle);
            const nextState = reducer(initialState, action);
            it('sets style of cell', () => {
                expect(nextState.getIn(['cells', 3, 2, 'style'])).to
                    .eql(fromJS(newStyle));
            });
        });
    });

    describe('IMPORT_GRID', () => {
        it('loads grid with correct style', () => {
            const initialState = fromJS({ cells: tenByTen });
            const compressedGrid = 'eMKcw63DlEsKwoMwFEbDocK9w5xOM8Kww6_DosK0w4sQBz7DklJqE8KIOijDosOeG8K5a8KQwqbDtDjDuQXCg8KfODhFMUnDo8OdYMOdIMO5JMKZw6QiRsK2OjvCncK9w45Bw6fCqHPDkjnDq1x0XsOVw4Mtd8KzwpF-eHd2eWVdNcOPe8OwwqNrwq_CvsOzIT7DnsOcw6LClWXDi8Kpw5rCh8OWwoY-wp7Cm2fCs8OywpfDgMOBw4F9wp0rw43DmsOJw7nCq8OfCQcHR1fDoMOgw6DDqAocHMOcD3B0BQ4Owo7CrsOAw4HDgcKlw47DkRU4ODjCugIHB8KXOkdXw6DDoMOgw6gKHBxcw6pcWX4AFEJzHw';
            const action = actions.importGrid(compressedGrid);
            const nextState = reducer(initialState, action);

            expect(nextState.getIn(['cells', 0, 0, 'style', 'backgroundColor'])).to.eq('#ffff00');
        });
    });
});
