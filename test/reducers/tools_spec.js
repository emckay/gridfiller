import { expect } from 'chai';

import actions from '../../src/actions/action_creators';
import reducer from '../../src/reducers/tools';

import { gridEditorWithoutActiveTool, gridEditorWithActiveTool }
    from '../fixtures/grid_editor';

describe('tools reducer', () => {
    const tool = { test_tool: 'test' };

    describe('TOGGLE_ACTIVE_STYLE_TOOL', () => {
        context('with no currently active tool', () => {
            const initialState = gridEditorWithoutActiveTool.get('tools');
            const action = actions.toggleActiveStyleTool(tool);
            const nextState = reducer(initialState, action);

            it('sets activeStyleTool', () => {
                expect(nextState.get('activeStyleTool')).to.eql(tool);
            });
        });

        context('with currently active tool', () => {
            const initialState = gridEditorWithActiveTool.get('tools');
            const action = actions.toggleActiveStyleTool(initialState.get('activeStyleTool'));
            const nextState = reducer(initialState, action);

            it('clears activeStyleTool', () => {
                expect(nextState.get('activeStyleTool')).to.eq(undefined);
            });
        });
    });

    describe('CLEAR_ACTIVE_STYLE_TOOL', () => {
        const action = actions.clearActiveStyleTool();
        const initialState = gridEditorWithoutActiveTool.get('tools');
        const nextState = reducer(initialState, action);

        it('clears activeStyleTool', () => {
            expect(nextState.get('activeStyleTool')).to.eq(undefined);
        });
    });
});
