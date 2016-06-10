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

        context('with border style tool', () => {
            const initialState = gridEditor.withBorderTool;
            const startingBorder = 1;
            const edgeStartingBorder = 2;
            const startingMargin = 0;
            const startingDim = 60;

            const adjacentCells = (row, col) => ({
                above: { pos: [row - 1, col] },
                left: { pos: [row, col - 1] },
                clicked: { pos: [row, col] },
                below: { pos: [row + 1, col] },
                right: { pos: [row, col + 1] },
            });

            const stateToStyle = (state, cell, style) => (
                state.get('grid').present.getIn(['cells', ...cell, 'style', style])
            );

            const checkStyles = (state, cell, msg) => {
                for (const style of Object.keys(cell.styles)) {
                    expect(stateToStyle(state, cell.pos, style)).to
                        .eq(cell.styles[style], `${msg} ${style}`);
                }
            };

            context('with typical cell', () => {
                const cells = adjacentCells(2, 2);

                it('handles top clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 0);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderTopWidth: startingBorder + 1,
                        marginTop: startingMargin,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');

                    cells.above.styles = {
                        borderBottomWidth: startingBorder + 1,
                        marginTop: startingMargin,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.above, 'above');
                });

                it('handles right clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderRightWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');

                    cells.right.styles = {
                        borderLeftWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.right, 'right');
                });

                it('handles bottom clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 2);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderBottomWidth: startingBorder + 1,
                        marginTop: startingMargin,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');

                    cells.below.styles = {
                        borderTopWidth: startingBorder + 1,
                        marginTop: startingMargin,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.below, 'below');
                });

                it('handles left clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 3);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderLeftWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');

                    cells.left.styles = {
                        borderRightWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.left, 'left');
                });

                it('handles left then right', () => {
                    const left = actions.applyActiveStyleTool(...cells.clicked.pos, 3);
                    const firstState = reducer(initialState, left);
                    const right = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
                    const secondState = reducer(firstState, right);

                    cells.clicked.styles = {
                        borderLeftWidth: startingBorder + 1,
                        borderRightWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 2,
                    };

                    checkStyles(secondState, cells.clicked, 'clicked');

                    cells.left.styles = {
                        borderRightWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(secondState, cells.left, 'left');

                    cells.right.style = {
                        borderRightWidth: startingBorder + 1,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(secondState, cells.right, 'right');
                });
            });

            context('with cell in right col', () => {
                const cells = adjacentCells(1, 9);

                it('handles right clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderRightWidth: edgeStartingBorder + 2,
                        marginLeft: startingMargin,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');
                });

                it('handles right clicked twice', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
                    const firstState = reducer(initialState, action);
                    const secondState = reducer(firstState, action);

                    cells.clicked.styles = {
                        borderRightWidth: edgeStartingBorder + 4,
                        marginLeft: startingMargin,
                        width: startingDim - 2,
                    };

                    checkStyles(secondState, cells.clicked, 'clicked');
                });
            });

            context('with cell in bottom row', () => {
                const cells = adjacentCells(9, 1);

                it('handles bottom clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 2);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderBottomWidth: edgeStartingBorder + 2,
                        marginTop: startingMargin,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');
                });
            });

            context('with cell in left col', () => {
                const cells = adjacentCells(2, 0);

                it('handles left clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 3);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderLeftWidth: edgeStartingBorder + 2,
                        marginLeft: startingMargin - 1,
                        width: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');
                });
            });

            context('with cell in top row', () => {
                const cells = adjacentCells(0, 2);

                it('handles top clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 0);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderTopWidth: edgeStartingBorder + 2,
                        marginTop: -2,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');
                });

                it('handles bottom clicked', () => {
                    const action = actions.applyActiveStyleTool(...cells.clicked.pos, 2);
                    const nextState = reducer(initialState, action);

                    cells.clicked.styles = {
                        borderBottomWidth: startingBorder + 1,
                        marginTop: startingMargin - 1,
                        height: startingDim - 1,
                    };

                    checkStyles(nextState, cells.clicked, 'clicked');
                });
            });
        });
    });
});
