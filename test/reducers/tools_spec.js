import { expect } from 'chai';
import { fromJS } from 'immutable';

import actions from '../../src/actions/action_creators';
import reducer from '../../src/reducers/tools';

describe('tools reducer', () => {
    const tool = { test_tool: 'test' };

    describe('SET_ACTIVE_STYLE_TOOL', () => {
        const action = actions.setActiveStyleTool(tool);
        const initialState = fromJS({ activeStyleTool: {} });
        const nextState = reducer(initialState, action);

        it('sets activeStyleTool', () => {
            expect(nextState.get('activeStyleTool')).to.eql(tool);
        });
    });

    describe('CLEAR_ACTIVE_STYLE_TOOL', () => {
        const action = actions.clearActiveStyleTool();
        const initialState = fromJS({ activeStyleTool: tool });
        const nextState = reducer(initialState, action);

        it('clears activeStyleTool', () => {
            expect(nextState.get('activeStyleTool')).to.eq(undefined);
        });
    });
});
