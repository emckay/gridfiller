import { expect } from 'chai';

import * as actions from '../../../src/actions/grid';
import reducer from '../../../src/reducers/grid_editor/';

import gridEditor from '../../fixtures/grid_editor';

describe('TOGGLE_ACTIVE_CELL_CONTENT', () => {
    const action = actions.toggleActiveCellContent(1, 2, { contentId: '3', gridId: 'main' });

    context('without existing active cell content', () => {
        const initialState = gridEditor.withoutActiveTool;
        const nextState = reducer(initialState, action);

        it('should set active cell content', () => {
            expect(nextState.activeCellContent).to.have.property('row', 1);
            expect(nextState.activeCellContent).to.have.property('col', 2);
            expect(nextState.activeCellContent).to.have.property('contentId', '3');
        });
    });

    context('with existing active cell content', () => {
        it('changes to different active cell content', () => {
            const initialState = gridEditor.withActiveContentId(1, 2, '4');
            const nextState = reducer(initialState, action);

            expect(nextState.activeCellContent).to.have.property('row', 1);
            expect(nextState.activeCellContent).to.have.property('col', 2);
            expect(nextState.activeCellContent).to.have.property('contentId', '3');
        });

        it('clears if same active cell content', () => {
            const initialState = gridEditor.withActiveContentId();
            const nextState = reducer(initialState, action);

            expect(typeof(nextState.activeCellContent)).to.eq('undefined');
        });
    });
});

describe('MOVE_ACTIVE_CELL_CONTENT', () => {
    const checkNewActiveContent = (r, initialState, direction, { row, col, contentId }) => {
        const nextState = r(initialState, actions.moveActiveCellContent(direction));
        expect(nextState.activeCellContent).to.eql({ row, col, contentId });
    };

    context('with main content', () => {
        context('from typical cell', () => {
            const cell = [2, 3];
            const initialState = gridEditor.withActiveContentId(...cell, 'main');

            it('moves up', () => {
                checkNewActiveContent(reducer, initialState, 0,
                    { row: cell[0] - 1, col: cell[1], contentId: 'main' });
            });

            it('moves right', () => {
                checkNewActiveContent(reducer, initialState, 1,
                    { row: cell[0], col: cell[1] + 1, contentId: 'main' });
            });

            it('moves down', () => {
                checkNewActiveContent(reducer, initialState, 2,
                    { row: cell[0] + 1, col: cell[1], contentId: 'main' });
            });

            it('moves left', () => {
                checkNewActiveContent(reducer, initialState, 3,
                    { row: cell[0], col: cell[1] - 1, contentId: 'main' });
            });
        });

        context('from cell on right edge', () => {
            const cell = [0, 9];
            const initialState = gridEditor.withActiveContentId(...cell, 'main');

            it('wraps around', () => {
                checkNewActiveContent(reducer, initialState, 1,
                    { row: cell[0], col: 0, contentId: 'main' });
            });
        });
    });

    context('with mini content', () => {
        const cell = [2, 3];

        context('from center', () => {
            const initialState = gridEditor.withActiveContentId(...cell, '4');

            it('moves up', () => {
                checkNewActiveContent(reducer, initialState, 0,
                    { row: cell[0], col: cell[1], contentId: '1' });
            });

            it('moves right', () => {
                checkNewActiveContent(reducer, initialState, 1,
                    { row: cell[0], col: cell[1], contentId: '5' });
            });

            it('moves down', () => {
                checkNewActiveContent(reducer, initialState, 2,
                    { row: cell[0], col: cell[1], contentId: '7' });
            });

            it('moves left', () => {
                checkNewActiveContent(reducer, initialState, 3,
                    { row: cell[0], col: cell[1], contentId: '3' });
            });
        });

        context('from top left corner', () => {
            const initialState = gridEditor.withActiveContentId(...cell, '0');

            it('moves to cell above', () => {
                checkNewActiveContent(reducer, initialState, 0,
                    { row: cell[0] - 1, col: cell[1], contentId: '6' });
            });

            it('moves to cell left', () => {
                checkNewActiveContent(reducer, initialState, 3,
                    { row: cell[0], col: cell[1] - 1, contentId: '2' });
            });
        });

        context('from bottom right corner', () => {
            const initialState = gridEditor.withActiveContentId(...cell, '8');

            it('moves to cell right', () => {
                checkNewActiveContent(reducer, initialState, 1,
                    { row: cell[0], col: cell[1] + 1, contentId: '6' });
            });

            it('moves to cell below', () => {
                checkNewActiveContent(reducer, initialState, 2,
                    { row: cell[0] + 1, col: cell[1], contentId: '2' });
            });
        });

        context('from top of top row', () => {
            const initialState = gridEditor.withActiveContentId(0, 3, '1');

            it('wraps around', () => {
                checkNewActiveContent(reducer, initialState, 0,
                    { row: 9, col: 3, contentId: '7' });
            });
        });
    });
});
