import { expect } from 'chai';
import get from 'lodash/get';
import immutable from 'seamless-immutable';

import * as actions from '../../src/actions/grid';
import reducer from '../../src/reducers/grid';

import initialGrids from '../../src/store/data/grids/initial_grids';

const tenByTen = initialGrids[0];

describe('grid reducer', () => {
    describe('SET_STYLE', () => {
        const initialState = immutable({ cells: tenByTen });

        context('with immutable style', () => {
            const newStyle = immutable({ backgroundColor: 'red' });
            const action = actions.setStyle(3, 2, newStyle);
            const nextState = reducer(initialState, action);
            it('sets style of cell', () => {
                expect(get(nextState, ['cells', 3, 2, 'style'])).to
                    .eql(immutable(newStyle));
            });
        });

        context('with object style', () => {
            const newStyle = { backgroundColor: 'red' };
            const action = actions.setStyle(3, 2, newStyle);
            const nextState = reducer(initialState, action);
            it('sets style of cell', () => {
                expect(get(nextState, ['cells', 3, 2, 'style'])).to
                    .eql(immutable(newStyle));
            });
        });
    });

    describe('IMPORT_GRID', () => {
        it('loads grid with correct style', () => {
            const initialState = immutable({ cells: tenByTen });
            const compressedGrid = 'eMKcw63DlEsKwoMwFEbDocK9w5xOM8Kww6_DosK0w4sQBz7DklJqE8KIOijDosOeG8K5a8KQwqbDtDjDuQXCg8KfODhFMUnDo8OdYMOdIMO5JMKZw6QiRsK2OjvCncK9w45Bw6fCqHPDkjnDq1x0XsOVw4Mtd8KzwpF-eHd2eWVdNcOPe8OwwqNrwq_CvsOzIT7DnsOcw6LClWXDi8Kpw5rCh8OWwoY-wp7Cm2fCs8OywpfDgMOBw4F9wp0rw43DmsOJw7nCq8OfCQcHR1fDoMOgw6DDqAocHMOcD3B0BQ4Owo7CrsOAw4HDgcKlw47DkRU4ODjCugIHB8KXOkdXw6DDoMOgw6gKHBxcw6pcWX4AFEJzHw';
            const action = actions.importGrid(compressedGrid);
            const nextState = reducer(initialState, action);

            expect(get(nextState, ['cells', 0, 0, 'style', 'backgroundColor'])).to.eq('#ffff00');
        });
    });

    describe('reset checkpoints', () => {
        let initialState = immutable({ cells: tenByTen });
        initialState = initialState.setIn(['cells', 1, 2, 'style'], { backgroundColor: 'red' });
        const checkpointAction = actions.createResetCheckpoint();
        const resetAction = actions.resetToCheckpoint();
        let firstState = reducer(initialState, checkpointAction);

        it('creates reset checkpoint', () => {
            expect(firstState.checkpoint).to.be.instanceOf(Object);
            expect(get(firstState, ['checkpoint', 1, 2, 'style']))
                .to.eql({ backgroundColor: 'red' });
        });

        it('resets changed changed cells', () => {
            firstState = firstState.setIn(['cells', 1, 2, 'style'], { backgroundColor: 'blue' });
            const resetState = reducer(firstState, resetAction);
            expect(get(resetState, ['cells', 1, 2, 'style', 'backgroundColor']))
                .to.eq('red');
        });

        it('resets newly changed cells', () => {
            firstState = firstState.setIn(['cells', 2, 3, 'style'], { backgroundColor: 'blue' });
            const resetState = reducer(firstState, resetAction);
            expect(get(resetState, ['cells', 2, 3, 'style', 'backgroundColor']))
                .to.eq(undefined);
        });
    });
});
