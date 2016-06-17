import { expect } from 'chai';
import get from 'lodash/get';

import actions from '../../src/actions';
import reducer from '../../src/reducers/tools';

import gridEditor from '../fixtures/grid_editor';
import { staticTool } from '../fixtures/tools';

describe('tools reducer', () => {
    const tool = staticTool;

    describe('TOGGLE_ACTIVE_STYLE_TOOL', () => {
        context('with no currently active tool', () => {
            const initialState = gridEditor.withoutActiveTool.tools;
            const action = actions.toggleActiveStyleTool(tool);
            const nextState = reducer(initialState, action);

            it('sets activeStyleTool', () => {
                expect(nextState.activeStyleTool).to.eql(tool);
            });
        });

        context('with currently active tool', () => {
            const initialState = gridEditor.withActiveTool.tools;
            const action = actions.toggleActiveStyleTool(initialState.activeStyleTool);
            const nextState = reducer(initialState, action);

            it('clears activeStyleTool', () => {
                expect(nextState.activeStyleTool).to.eq(undefined);
            });

            it('clears mode', () => {
                expect(nextState.mode).to.eq(undefined);
            });
        });
    });

    describe('CLEAR_ACTIVE_STYLE_TOOL', () => {
        const action = actions.clearActiveStyleTool();
        const initialState = gridEditor.withoutActiveTool.tools;
        const nextState = reducer(initialState, action);

        it('clears activeStyleTool', () => {
            expect(nextState.activeStyleTool).to.eq(undefined);
        });

        it('clears mode', () => {
            expect(nextState.mode).to.eq(undefined);
        });
    });

    describe('SET_SHARED_OPTION', () => {
        const action = actions.setSharedOption('primaryColor', 'new color');
        const initialState = gridEditor.withoutActiveTool.tools;
        const nextState = reducer(initialState, action);

        it('changes shared option', () => {
            expect(get(nextState, ['sharedOptions', 'primaryColor'])).to
                .eq('new color');
        });
    });

    describe('TOGGLE_ACTIVE_CELL_CONTENT', () => {
        const action = actions.toggleActiveCellContent(1, 2, '3');

        context('without existing active cell content', () => {
            const initialState = gridEditor.withoutActiveTool.tools;
            const nextState = reducer(initialState, action);

            it('should set active cell content', () => {
                expect(nextState.activeCellContent).to.have.property('row', 1);
                expect(nextState.activeCellContent).to.have.property('col', 2);
                expect(nextState.activeCellContent).to.have.property('contentId', '3');
            });
        });

        context('with existing active cell content', () => {
            it('changes to different active cell content', () => {
                const initialState = gridEditor.withActiveContentId(1, 2, '4').tools;
                const nextState = reducer(initialState, action);

                expect(nextState.activeCellContent).to.have.property('row', 1);
                expect(nextState.activeCellContent).to.have.property('col', 2);
                expect(nextState.activeCellContent).to.have.property('contentId', '3');
            });

            it('clears if same active cell content', () => {
                const initialState = gridEditor.withActiveContentId().tools;
                const nextState = reducer(initialState, action);

                expect(typeof(nextState.activeCellContent)).to.eq('undefined');
            });
        });
    });
});
