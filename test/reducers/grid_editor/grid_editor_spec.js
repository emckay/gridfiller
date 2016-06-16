import { expect } from 'chai';

import { Map, fromJS } from 'immutable';

import defaults from '../../../src/defaults';
import actions from '../../../src/actions';
import reducer from '../../../src/reducers/grid_editor';

import gridEditor from '../../fixtures/grid_editor';

import { borderStyleTests } from './border_styles.js';

const stateToCell = (state, cell) => (
    state.get('grid').present.getIn(['cells', ...cell])
);

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

    describe('UPDATE_CELL_CONTENT', () => {
        const action = actions.updateCellContent('test text');

        context('with active content id', () => {
            const initialState = gridEditor.withActiveContentId();
            const nextState = reducer(initialState, action);

            it('sets cell content', () => {
                const newContent = nextState.get('grid').present
                    .getIn(['cells', 1, 2, 'content', '3']);
                expect(newContent).to.be.instanceOf(Map);
                expect(newContent).to.have.property('text', 'test text');
            });
        });

        context('without active content id', () => {
            const initialState = gridEditor.withoutActiveTool;
            const nextState = reducer(initialState, action);

            it('does not change state', () => {
                expect(initialState).to.deep.eq(nextState);
            });
        });
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

        borderStyleTests(reducer);

        context('content styles', () => {
            const cell = [0, 0];

            context('with main content style tool', () => {
                const initialState = gridEditor.withContentStyleTool;
                const action = actions.applyActiveStyleTool(...cell, 'main');

                it('changes style', () => {
                    const nextState = reducer(initialState, action);
                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 'main', 'style', 'backgroundColor']
                    )).to.eq('red');
                });
            });

            context('with mini content style tool', () => {
                const initialState = gridEditor.withContentStyleTool;
                const action = actions.applyActiveStyleTool(...cell, 3);

                it('changes style', () => {
                    const nextState = reducer(initialState, action);
                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 3, 'style', 'backgroundColor']
                    )).to.eq('red');
                });
            });

            context('with toggle content style tool', () => {
                const initialState = gridEditor.withContentBoldTool;
                const action = actions.applyActiveStyleTool(...cell, 3);

                it('changes to bold first', () => {
                    const nextState = reducer(initialState, action);
                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 3, 'style', 'fontWeight']
                    )).to.eq('bold');
                });

                it('unsets on second click', () => {
                    const firstState = reducer(initialState, action);
                    const secondState = reducer(firstState, action);

                    expect(stateToCell(secondState, cell).getIn(
                        ['content', 3, 'style', 'fontWeight']
                    )).to.eq(undefined);
                });
            });

            context('with relative content style tool', () => {
                it('moves mini top by -2 each time', () => {
                    const initialState = gridEditor.withMiniContentUpTool;
                    const action = actions.applyActiveStyleTool(...cell, 2);
                    const nextState = reducer(initialState, action);
                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 2, 'style', 'top']
                    )).to.eq(-2);

                    const secondState = reducer(nextState, action);
                    expect(stateToCell(secondState, cell).getIn(
                        ['content', 2, 'style', 'top']
                    )).to.eq(-4);
                });

                it('moves main top by -2 each time', () => {
                    const initialState = gridEditor.withMainContentUpTool;
                    const action = actions.applyActiveStyleTool(...cell, 'main');
                    const nextState = reducer(initialState, action);
                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 'main', 'style', 'top']
                    )).to.eq(-2);

                    const secondState = reducer(nextState, action);
                    expect(stateToCell(secondState, cell).getIn(
                        ['content', 'main', 'style', 'top']
                    )).to.eq(-4);
                });

                it('increases font size', () => {
                    const initialState = gridEditor.withFontIncreaseTool;
                    const action = actions.applyActiveStyleTool(...cell, 'main');
                    const nextState = reducer(initialState, action);

                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 'main', 'style', 'fontSize']
                    )).to.be.greaterThan(defaults.contentFontSize('main'));
                });

                it('decreases mini font size', () => {
                    const initialState = gridEditor.withMiniFontDecreaseTool;
                    const action = actions.applyActiveStyleTool(...cell, 4);
                    const nextState = reducer(initialState, action);

                    expect(stateToCell(nextState, cell).getIn(
                        ['content', 4, 'style', 'fontSize']
                    )).to.be.lessThan(defaults.contentFontSize(4));
                });
            });
        });

        context('clear tools', () => {
            context('clear content tool', () => {
                it('resets all content', () => {
                    let initialState = gridEditor.withClearContentTool;
                    initialState = initialState.set('grid', {
                        past: [],
                        future: [],
                        present: initialState.get('grid').present.setIn(['cells', 2, 3, 'content', 0, 'text'], 'hello')
                    });
                    const cell = [2, 3];
                    const action = actions.applyActiveStyleTool(...cell);
                    const nextState = reducer(initialState, action);

                    expect(stateToCell(nextState, cell).getIn(
                        ['content', '0', 'text']
                    )).to.eq('');
                });
            });
        });
    });
});
