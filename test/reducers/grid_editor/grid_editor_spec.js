import { expect } from 'chai';

import { Map, fromJS } from 'immutable';

import actions from '../../../src/actions';
import reducer from '../../../src/reducers/grid_editor';

import gridEditor from '../../fixtures/grid_editor';

import { borderStyleTests } from './border_styles.js';

const stateToCell = (state, cell) => (
    state.get('grid').present.getIn(['cells', ...cell])
);

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

    describe('UPDATE_CELL_CONTENT', () => {
        const action = actions.updateCellContent('test text');

        context('with active content id', () => {
            const initialState = gridEditor.withActiveContentId();
            const nextState = reducer(initialState, action);

            it('sets cell content', () => {
                const newContent = nextState.get('grid').present
                    .getIn(['cells', 1, 2, 'content', '3']);
                expect(newContent).to.be.instanceOf(Map);
                expect(newContent).to.have.property('text', 'test text');
            });
        });

        context('without active content id', () => {
            const initialState = gridEditor.withoutActiveTool;
            const nextState = reducer(initialState, action);

            it('does not change state', () => {
                expect(initialState).to.deep.eq(nextState);
            });
        });
    });

    describe('APPLY_ACTIVE_STYLE_TOOL', () => {
        context('without active tool', () => {
            const action = actions.applyActiveStyleTool(0, 0);

            const initialState = gridEditor.withoutActiveTool;
            const nextState = reducer(initialState, action);

            it('does not change state', () => {
                expect(nextState).to.deep.eq(initialState);
            });
        });

        context('with cell style tool', () => {
            const action = actions.applyActiveStyleTool(0, 0);

            const doesNotOverwrite = (a) => {
                it('does not overwrite other styles', () => {
                    const initialState = gridEditor.withStaticTool;
                    const firstElementStylePos = ['cells', 0, 0, 'style'];
                    initialState.get('grid').present = initialState.get('grid').present
                        .setIn(firstElementStylePos, new Map({ borderTopWidth: 2 }));

                    const nextState = reducer(initialState, a);

                    expect(nextState.get('grid').present.getIn(firstElementStylePos)).to
                        .include.property('borderTopWidth', 2);
                });
            };

            context('with static active tool', () => {
                it('changes style of first element', () => {
                    const initialState = gridEditor.withStaticTool;
                    const nextState = reducer(initialState, action);
                    const firstElementStylePos = ['cells', 0, 0, 'style'];
                    expect(nextState.get('grid').present.getIn(firstElementStylePos)).to
                        .eql(initialState.getIn(['tools', 'activeStyleTool', 'style']));
                });

                doesNotOverwrite(action);
            });

            context('with dynamic active tool', () => {
                const initialState = gridEditor.withDynamicTool;
                const nextState = reducer(initialState, action);

                it('changes style of first element', () => {
                    const firstElementStylePos = ['cells', 0, 0, 'style'];
                    expect(nextState.get('grid').present.getIn(firstElementStylePos)).to
                        .eql(fromJS({ backgroundColor: 'red' }));
                });

                doesNotOverwrite(action);
            });
        });

        borderStyleTests(reducer);

        context('with main content style tool', () => {
            const initialState = gridEditor.withContentStyleTool;
            const cell = [0, 0];
            const action = actions.applyActiveStyleTool(...cell, 'main');

            it('changes style', () => {
                const nextState = reducer(initialState, action);
                expect(stateToCell(nextState, cell).getIn(
                    ['content', 'main', 'style', 'backgroundColor']
                )).to.eq('red');
            });
        });

        context('with mini content style tool', () => {
            const initialState = gridEditor.withContentStyleTool;
            const cell = [0, 0];
            const action = actions.applyActiveStyleTool(...cell, 3);

            it('changes style', () => {
                const nextState = reducer(initialState, action);
                expect(stateToCell(nextState, cell).getIn(
                    ['content', 3, 'style', 'backgroundColor']
                )).to.eq('red');
            });
        });
    });
});
