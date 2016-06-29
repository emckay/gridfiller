import { expect } from 'chai';
import immutable from 'seamless-immutable';

import reducer from '../../src/reducers/grid_editor';

import actions from '../../src/actions';

import gridEditor from '../fixtures/grid_editor';
import {
    getGalleryCell,
    expectStyle,
    changeStyle,
    changeContentText,
    expectContentText,
} from './grid_editor/helpers';

describe('gallery', () => {
    describe('updating gallery', () => {
        describe('APPLY_ACTIVE_STYLE_TOOL', () => {
            it('changes style of gallery cell', () => {
                const initialState = gridEditor.withStaticTool;
                const action = actions.applyActiveStyleTool(0, 0, { gridId: 2 });
                const nextState = reducer(initialState, action);

                expect(getGalleryCell(nextState, 2).style)
                    .to.have.property('backgroundColor', 'red');
            });
        });

        describe('UPDATE_CELL_CONTENT', () => {
            it('adds text to cell content', () => {
                const initialState = gridEditor.withActiveContentId(0, 0, 'main', 2);
                const action = actions.updateCellContent('sample text');
                const nextState = reducer(initialState, action);

                expect(getGalleryCell(nextState, 2).content.main.text)
                    .to.eq('sample text');
            });
        });

        describe('TOGGLE_ACTIVE_CELL_CONTENT', () => {
            it('selects new grid if one is already selected', () => {
                const initialState = gridEditor.withActiveContentId(0, 0, 'main', 2);
                const action = actions.toggleActiveCellContent(0, 0, { contentId: 'main', gridId: 3 });
                const nextState = reducer(initialState, action);

                expect(nextState.activeCellContent).to.have.property('gridId', 3);
            });
        });

        describe('borders', () => {
            it('increases width of border', () => {
                const initialState = gridEditor.withBorderWidthTool(2);
                const action = actions.applyActiveStyleTool(0, 0, { gridId: 1, target: 0 });
                const nextState = reducer(initialState, action);

                expect(getGalleryCell(nextState, 1).style)
                    .to.have.property('borderTopWidth', 4);
            });

            it('changes style of border', () => {
                const initialState = gridEditor.withBorderStyleTool;
                const action = actions.applyActiveStyleTool(0, 0, { gridId: 1, target: 0 });
                const nextState = reducer(initialState, action);

                expect(getGalleryCell(nextState, 1).style)
                    .to.have.property('borderTopStyle', 'dashed');
            });
        });
    });

    describe('copying cells', () => {
        describe('COPY_CELL', () => {
            it('adds cell index to state', () => {
                const initialState = gridEditor.withCopyTool;
                const action = actions.applyActiveStyleTool(0, 0, { gridId: 1 });
                const nextState = reducer(initialState, action);

                expect(nextState.copiedCell)
                    .to.eql(immutable({ gridId: 1, row: 0, col: 0 }));
            });
        });

        describe('PASTE_CELL', () => {
            it('copies backgroundColor', () => {
                let initialState = gridEditor.withPasteTool({ row: 0, col: 0, gridId: 1 });
                initialState = changeStyle(initialState, [0, 0, 1], 'backgroundColor', 'yellow');
                const action = actions.applyActiveStyleTool(2, 3, { gridId: 'main' });
                const nextState = reducer(initialState, action);

                expectStyle(nextState, [2, 3, 'main'], 'backgroundColor', 'yellow');
            });

            it('copies border width to neighboring cells', () => {
                let initialState = gridEditor.withPasteTool({ row: 0, col: 0, gridId: 1 });
                initialState = changeStyle(initialState, [0, 0, 1], 'borderTopWidth', 4);

                const action = actions.applyActiveStyleTool(2, 3, { gridId: 'main' });
                const nextState = reducer(initialState, action);

                expectStyle(nextState, [2, 3, 'main'], 'borderTopWidth', 2);
                expectStyle(nextState, [1, 3, 'main'], 'borderTopWidth', 2);
            });

            it('copies content', () => {
                let initialState = gridEditor.withPasteTool({ row: 0, col: 0, gridId: 1 });
                initialState = changeContentText(initialState, [0, 0, 1], 'main', 'test');

                const action = actions.applyActiveStyleTool(2, 3, { gridId: 'main' });
                const nextState = reducer(initialState, action);

                console.log('new state', nextState.grid.present.cells[2][3].content);

                expectContentText(nextState, [2, 3, 'main'], 'main', 'test');
            });
        });
    });
});
