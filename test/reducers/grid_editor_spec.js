import { expect } from 'chai';

import { Map, fromJS } from 'immutable';

import actions from '../../src/actions/action_creators';
import reducer from '../../src/reducers/grid_editor';

import gridEditor from '../fixtures/grid_editor';

describe('grid editor reducer', () => {
    context('with undefined initial state and unknown action', () => {
        const initialState = undefined;
        const action = 'UNKNOWN';
        const nextState = reducer(initialState, action);

        it('returns immutable Map', () => {
            expect(nextState).to.be.instanceOf(Map);
        });

        for (const [substate, type] of [['grid', Object], ['tools', Map]]) {
            it(`returns empty ${substate} sub-state`, () => {
                expect(nextState).to.include.key(substate);
                expect(nextState.get(substate)).to.be.instanceOf(type);
            });
        }
    });

    describe('APPLY_ACTIVE_STYLE_TOOL', () => {
        const action = actions.applyActiveStyleTool(0, 0);

        context('without active tool', () => {
            const initialState = gridEditor.withoutActiveTool;
            const nextState = reducer(initialState, action);

            it('does not change state', () => {
                expect(nextState).to.deep.eq(initialState);
            });
        });

        context('with static active tool', () => {
            const initialState = gridEditor.withStaticTool;
            const nextState = reducer(initialState, action);

            it('changes style of first element', () => {
                const firstElementStylePos = ['cells', 0, 0, 'style'];
                expect(nextState.get('grid').present.getIn(firstElementStylePos)).to
                    .eql(initialState.getIn(['tools', 'activeStyleTool', 'style']));
            });
        });

        context('with dynamic active tool', () => {
            const initialState = gridEditor.withDynamicTool;
            const nextState = reducer(initialState, action);

            it('changes style of first element', () => {
                const firstElementStylePos = ['cells', 0, 0, 'style'];
                expect(nextState.get('grid').present.getIn(firstElementStylePos)).to
                    .eql(fromJS({ backgroundColor: 'red' }));
            });
        });
    });
});
