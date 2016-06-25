import { expect } from 'chai';
import get from 'lodash/get';

import { changeStyle, expectStyle } from './helpers';

import actions from '../../../src/actions';
import defaults from '../../../src/defaults';
import reducer from '../../../src/reducers/grid_editor';

import gridEditor from '../../fixtures/grid_editor';


const stateToStyle = (state, cell, style) => (
    get(state, ['grid', 'present', 'cells', ...cell, 'style', style])
);

const adjacentCells = (row, col) => ({
    above: { pos: [row - 1, col] },
    left: { pos: [row, col - 1] },
    clicked: { pos: [row, col] },
    below: { pos: [row + 1, col] },
    right: { pos: [row, col + 1] },
});

const checkStyles = (state, cell, msg) => {
    for (const style of Object.keys(cell.styles)) {
        expect(stateToStyle(state, cell.pos, style)).to
            .eq(cell.styles[style], `${msg} ${style}`);
    }
};

describe('border width tools', () => {
    const initialState = gridEditor.withBorderWidthTool(2);
    const startingBorder = defaults.borderTopWidth(true);
    const edgeStartingBorder = defaults.borderTopWidth(false);
    const startingMargin = defaults.marginTop(true, 1);
    const startingDim = defaults.width();

    context('with typical cell', () => {
        const cells = adjacentCells(2, 4);

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

        it('handles decreasing twice', () => {
            const decreasingState = gridEditor.withBorderWidthTool(-2);
            const action = actions.applyActiveStyleTool(...cells.clicked.pos, 0);
            const firstState = reducer(decreasingState, action);
            const secondState = reducer(firstState, action);

            cells.clicked.styles = {
                borderTopWidth: 0,
                marginTop: 0,
                height: startingDim + 1,
            };

            checkStyles(secondState, cells.clicked, 'clicked');

            cells.above.styles = {
                borderBottomWidth: 0,
                marginTop: 0,
                height: startingDim + 1,
            };

            checkStyles(secondState, cells.above, 'above');
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

describe('border style tools', () => {
    const initialState = gridEditor.withBorderStyleTool;

    context('with typical cell', () => {
        const cells = adjacentCells(2, 2);

        it('handles top click', () => {
            const action = actions.applyActiveStyleTool(...cells.clicked.pos, 0);
            const nextState = reducer(initialState, action);

            cells.clicked.styles = {
                borderTopStyle: 'dashed',
            };

            checkStyles(nextState, cells.clicked, 'clicked');

            cells.above.styles = {
                borderBottomStyle: 'dashed',
            };

            checkStyles(nextState, cells.above, 'above');
        });

        it('handles right click', () => {
            const action = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
            const nextState = reducer(initialState, action);

            cells.clicked.styles = {
                borderRightStyle: 'dashed',
            };

            checkStyles(nextState, cells.clicked, 'clicked');

            cells.right.styles = {
                borderLeftStyle: 'dashed',
            };

            checkStyles(nextState, cells.right, 'right');
        });

        it('handles two clicks', () => {
            const action = actions.applyActiveStyleTool(...cells.clicked.pos, 1);
            const firstState = reducer(initialState, action);
            const secondState = reducer(firstState, action);

            cells.clicked.styles = {
                borderRightStyle: 'solid',
            };

            checkStyles(secondState, cells.clicked, 'clicked');

            cells.right.styles = {
                borderLeftStyle: 'solid',
            };

            checkStyles(secondState, cells.right, 'right');
        });
    });
});
