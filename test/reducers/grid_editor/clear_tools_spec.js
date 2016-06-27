import {
    changeContentText,
    changeStyle,
    expectStyle,
    expectContentText,
} from './helpers';

import actions from '../../../src/actions';
import gridEditor from '../../fixtures/grid_editor';

import reducer from '../../../src/reducers/grid_editor';

describe('clear tools', () => {
    context('clear content tool', () => {
        it('resets all content', () => {
            let initialState = gridEditor.withClearContentTool;
            const cell = [2, 3];
            initialState = changeContentText(initialState, cell, 0, 'hello');
            initialState = changeContentText(initialState, cell, 1, 'hello2');
            initialState = changeContentText(initialState, cell, 'main', 'hello3');
            const action = actions.applyActiveStyleTool(...cell);
            const nextState = reducer(initialState, action);

            expectContentText(nextState, cell, 0, '');
            expectContentText(nextState, cell, 1, '');
            expectContentText(nextState, cell, 'main', '');
        });
    });

    context('clear all tool', () => {
        let initialState = gridEditor.withClearAllTool;
        const cell = [4, 6];
        const aboveCell = [cell[0] - 1, cell[1]];

        initialState = changeContentText(initialState, cell, 0, 'hello');
        initialState = changeContentText(initialState, cell, 1, 'hello2');
        initialState = changeContentText(initialState, cell, 'main', 'hello3');

        initialState = changeStyle(initialState, cell, 'borderTopWidth', 4);
        initialState = changeStyle(initialState, aboveCell, 'borderBottomWidth', 4);

        initialState = changeStyle(initialState, cell, 'backgroundColor', 'red');

        const action = actions.applyActiveStyleTool(...cell);
        const nextState = reducer(initialState, action);

        it('resets all content', () => {
            expectContentText(nextState, cell, 0, '');
            expectContentText(nextState, cell, 1, '');
            expectContentText(nextState, cell, 'main', '');
        });

        it('resets all borders', () => {
            expectStyle(nextState, cell, 'borderTopWidth', undefined);
            expectStyle(nextState, aboveCell, 'borderBottomWidth', 1);
        });

        it('resets other styles', () => {
            expectStyle(nextState, cell, 'backgroundColor', undefined);
        });
    });

    context('with clear single border width', () => {
        const cellStyleInd = (row, col) =>
            ['grid', 'present', 'cells', row, col, 'style'];

        let initialState = gridEditor.withResetSingleBorderTool;

        const cell = [4, 2];
        const adjCell = [cell[0], cell[1] + 1];

        initialState = initialState.setIn(
            [...cellStyleInd(...cell), 'borderRightWidth'],
            3
        );
        initialState = initialState.setIn(
            [...cellStyleInd(...adjCell), 'borderLeftWidth'],
            3
        );
        const action = actions.applyActiveStyleTool(...cell, { target: 1 });
        const nextState = reducer(initialState, action);

        it('resets border in this cell', () => {
            expectStyle(nextState, cell, 'borderRightWidth', 1);
        });

        it('resets border in adjacent cell', () => {
            expectStyle(nextState, adjCell, 'borderLeftWidth', 1);
        });
    });

    context('with clear all border widths and styles', () => {
        let initialState = gridEditor.withResetAllBordersTool;

        const cell = [4, 2];
        const rightCell = [cell[0], cell[1] + 1];
        const aboveCell = [cell[0] - 1, cell[1]];
        const belowCell = [cell[0] + 1, cell[1]];

        initialState = changeStyle(initialState, cell, 'borderRightWidth', 3);
        initialState = changeStyle(initialState, rightCell, 'borderLeftWidth', 3);
        initialState = changeStyle(initialState, cell, 'borderTopWidth', 10);
        initialState = changeStyle(initialState, aboveCell, 'borderBottomWidth', 10);
        initialState = changeStyle(initialState, cell, 'borderBottomStyle', 'dashed');
        initialState = changeStyle(initialState, belowCell, 'borderBottomStyle', 'dashed');

        const action = actions.applyActiveStyleTool(...cell, { target: 1 });
        const nextState = reducer(initialState, action);

        it('resets borders in this cell', () => {
            expectStyle(nextState, cell, 'borderRightWidth', 1);
            expectStyle(nextState, cell, 'borderTopWidth', 1);
        });

        it('resets borders in adjacent cells', () => {
            expectStyle(nextState, rightCell, 'borderLeftWidth', 1);
            expectStyle(nextState, aboveCell, 'borderBottomWidth', 1);
        });
    });
});
