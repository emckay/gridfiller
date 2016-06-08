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

        context('with border style tool', () => {
            const initialState = gridEditor.withBorderTool;

            const getBorderStyles = (state, row, col) => (
                state.get('grid').present.getIn(['cells', row, col, 'style'])
                    .filter((v, k) => k.indexOf('border') > -1)
            );

            const expectationsToTests = (cells, expectations) => {
                for (const o of expectations) {
                    it(`changes ${o.style} of ${o.cell} cell`, () => {
                        const action = actions.applyActiveStyleTool(...cells.clicked, o.border);
                        const nextState = reducer(initialState, action);

                        expect(getBorderStyles(nextState, ...cells[o.cell])).to.have.key(o.style);
                    });
                }
            };

            context('with typical cell', () => {
                const cells = { clicked: [0, 1], below: [1, 1], right: [0, 2] };

                const expectations = [
                    { border: 0, style: 'borderTopWidth', cell: 'clicked' },
                    { border: 1, style: 'borderLeftWidth', cell: 'right' },
                    { border: 2, style: 'borderTopWidth', cell: 'below' },
                    { border: 3, style: 'borderLeftWidth', cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with right col cell', () => {
                const cells = { clicked: [0, 9], below: [1, 9] };

                const expectations = [
                    { border: 0, style: 'borderTopWidth', cell: 'clicked' },
                    { border: 1, style: 'borderRightWidth', cell: 'clicked' },
                    { border: 2, style: 'borderTopWidth', cell: 'below' },
                    { border: 3, style: 'borderLeftWidth', cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with bottom row cell', () => {
                const cells = { clicked: [9, 0], right: [9, 1] };

                const expectations = [
                    { border: 0, style: 'borderTopWidth', cell: 'clicked' },
                    { border: 1, style: 'borderLeftWidth', cell: 'right' },
                    { border: 2, style: 'borderBottomWidth', cell: 'clicked' },
                    { border: 3, style: 'borderLeftWidth', cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with bottom right corner cell', () => {
                const cells = { clicked: [0, 9], below: [1, 9] };

                const expectations = [
                    { border: 0, style: 'borderTopWidth', cell: 'clicked' },
                    { border: 1, style: 'borderRightWidth', cell: 'clicked' },
                    { border: 2, style: 'borderBottomWidth', cell: 'clicked' },
                    { border: 3, style: 'borderLeftWidth', cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });
        });
    });
});
