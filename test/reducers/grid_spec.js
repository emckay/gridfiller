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
});
