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
            const startingWidth = 50;
            const startingBorder = 1;
            const startingMarginTop = 0;

            const getStyles = (state, row, col) => (
                state.get('grid').present.getIn(['cells', row, col, 'style'])
            );

            const expectationsToTests = (cells, expectations) => {
                for (const e of expectations) {
                    for (const style of Object.keys(e.styles)) {
                        const value = e.styles[style];
                        const action = actions.applyActiveStyleTool(...cells.clicked, e.border);
                        const nextState = reducer(initialState, action);

                        it(`changes ${style} of ${e.cell} cell`, () => {
                            expect(getStyles(nextState, ...cells[e.cell])
                                .get(style)).to.eq(value);
                        });
                    }

                    it('does not have any other styles', () => {
                        const action = actions.applyActiveStyleTool(...cells.clicked, e.border);
                        const nextState = reducer(initialState, action);
                        console.log(getStyles(nextState, ...cells[e.cell]));
                        expect(Object.keys(getStyles(nextState, ...cells[e.cell]).toJS())).to.eql(Object.keys(e.styles));
                    });
                }
            };

            const yBorderStyles = {
                borderTopWidth: startingBorder + 2,
                marginTop: startingMarginTop - 1,
                height: startingWidth - 1,
            };
            const xBorderStyles = {
                borderLeftWidth: startingBorder + 2,
                marginLeft: startingMarginTop - 1,
                width: startingWidth - 1,
            };
            const xEndBorderStyles = {
                borderRightWidth: startingBorder + 2,
                width: startingWidth - 1,
            };
            const yNextBorderStyles = {
                borderTopWidth: startingBorder + 2,
                marginTop: startingMarginTop - 1,
                height: startingWidth - 1,
            };

            context('with typical cell', () => {
                const cells = { clicked: [0, 1], below: [1, 1], right: [0, 2] };

                const expectations = [
                    { border: 0, styles: yBorderStyles, cell: 'clicked' },
                    { border: 1, styles: xBorderStyles, cell: 'right' },
                    { border: 2, styles: yBorderStyles, cell: 'below' },
                    { border: 3, styles: xBorderStyles, cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with right col cell', () => {
                const cells = { clicked: [0, 9], below: [1, 9] };

                const expectations = [
                    { border: 0, styles: yBorderStyles, cell: 'clicked' },
                    { border: 1, styles: xEndBorderStyles, cell: 'clicked' },
                    { border: 2, styles: yBorderStyles, cell: 'below' },
                    { border: 3, styles: xBorderStyles, cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with bottom row cell', () => {
                const cells = { clicked: [9, 0], right: [9, 1] };

                const expectations = [
                    { border: 0, styles: yBorderStyles, cell: 'clicked' },
                    { border: 1, styles: xBorderStyles, cell: 'right' },
                    { border: 2, styles: yBorderStyles, cell: 'clicked' },
                    { border: 3, styles: xBorderStyles, cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('with bottom right corner cell', () => {
                const cells = { clicked: [9, 9] };

                const expectations = [
                    { border: 0, styles: yBorderStyles, cell: 'clicked' },
                    { border: 1, styles: xBorderStyles, cell: 'clicked' },
                    { border: 2, styles: yBorderStyles, cell: 'clicked' },
                    { border: 3, styles: xBorderStyles, cell: 'clicked' },
                ];

                expectationsToTests(cells, expectations);
            });

            context('when applied twice', () => {
                it('increases width twice', () => {
                    const action = actions.applyActiveStyleTool(0, 0, 0);
                    const firstState = reducer(initialState, action);
                    const secondState = reducer(firstState, action);

                    expect(getStyles(secondState, 0, 0)
                        .get('borderTopWidth')).to.eq(startingBorder + 4);
                    expect(getStyles(secondState, 0, 0)
                        .get('marginTop')).to.eq(startingMarginTop - 2);
                    expect(getStyles(secondState, 0, 0)
                        .get('height')).to.eq(startingWidth - 2);
                });
            });
        });
    });
});
