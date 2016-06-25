import { expect } from 'chai';
import get from 'lodash/get';
import immutable from 'seamless-immutable';

import defaults from '../../../src/defaults';
import actions from '../../../src/actions';
import reducer from '../../../src/reducers/grid_editor';

import {
    getContentStyle,
    expectContentStyle,
} from './helpers';

import gridEditor from '../../fixtures/grid_editor';

describe('grid editor reducer', () => {
    context('with undefined initial state and unknown action', () => {
        const initialState = undefined;
        const action = 'UNKNOWN';
        const nextState = reducer(initialState, action);

        it('returns immutable state', () => {
            expect(nextState).to.be.instanceOf(Object);
            expect(() => { nextState.a = 1; }).to.throw(TypeError);
        });

        for (const [substate, type] of [['grid', Object], ['tools', Object]]) {
            it(`returns empty ${substate} sub-state`, () => {
                expect(nextState).to.include.key(substate);
                expect(nextState[substate]).to.be.instanceOf(type);
            });
        }
    });

    context('with existing initial state and some other action', () => {
        it('does not erase activeCellContent', () => {
            const initialState = gridEditor.withActiveContentId(2, 3, 'main');
            const activeCellContent = { row: 2, col: 3, contentId: 'main' };

            expect(initialState.activeCellContent).to.eql(activeCellContent);

            const nextState = reducer(initialState, { type: 'dummy' });
            expect(nextState.activeCellContent).to.eql(activeCellContent);
        });
    });

    describe('UPDATE_CELL_CONTENT', () => {
        const action = actions.updateCellContent('test text');

        context('with active content id', () => {
            const initialState = gridEditor.withActiveContentId(1, 2, '3');
            const nextState = reducer(initialState, action);

            it('sets cell content', () => {
                const newContent = get(nextState,
                    ['grid', 'present', 'cells', 1, 2, 'content', '3']
                );
                expect(newContent).to.be.instanceOf(Object);
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
            const firstElementStylePos = ['grid', 'present', 'cells', 0, 0, 'style'];

            const doesNotOverwrite = (a) => {
                it('does not overwrite other styles', () => {
                    let initialState = gridEditor.withStaticTool;
                    initialState = initialState.setIn(firstElementStylePos, { borderTopWidth: 2 });

                    const nextState = reducer(initialState, a);

                    expect(get(nextState, firstElementStylePos)).to
                        .include.property('borderTopWidth', 2);
                });
            };

            context('with static active tool', () => {
                it('changes style of first element', () => {
                    const initialState = gridEditor.withStaticTool;
                    const nextState = reducer(initialState, action);
                    expect(get(nextState, firstElementStylePos)).to
                        .eql(get(initialState, ['tools', 'activeStyleTool', 'style']));
                });

                doesNotOverwrite(action);
            });

            context('with dynamic active tool', () => {
                const initialState = gridEditor.withDynamicTool;
                const nextState = reducer(initialState, action);

                it('changes style of first element', () => {
                    expect(get(nextState, firstElementStylePos)).to
                        .eql(immutable({ backgroundColor: 'red' }));
                });

                doesNotOverwrite(action);
            });
        });

        context('content styles', () => {
            const cell = [0, 0];

            context('with main content style tool', () => {
                const initialState = gridEditor.withContentStyleTool;
                const action = actions.applyActiveStyleTool(...cell, 'main');

                it('changes style', () => {
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 'main', 'backgroundColor', 'red');
                });
            });

            context('with mini content style tool', () => {
                const initialState = gridEditor.withContentStyleTool;
                const action = actions.applyActiveStyleTool(...cell, 3);

                it('changes style', () => {
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 3, 'backgroundColor', 'red');
                });
            });

            context('with toggle content style tool', () => {
                const initialState = gridEditor.withContentBoldTool;
                const action = actions.applyActiveStyleTool(...cell, 3);

                it('changes to bold first', () => {
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 3, 'fontWeight', 'bold');
                });

                it('unsets on second click', () => {
                    const firstState = reducer(initialState, action);
                    const secondState = reducer(firstState, action);

                    expectContentStyle(secondState, cell, 3, 'fontWeight', undefined);
                });
            });

            context('with relative content style tool', () => {
                it('moves mini top by -2 each time', () => {
                    const initialState = gridEditor.withMiniContentUpTool;
                    const action = actions.applyActiveStyleTool(...cell, 2);
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 2, 'top', -2);

                    const secondState = reducer(nextState, action);
                    expectContentStyle(secondState, cell, 2, 'top', -4);
                });

                it('moves main top by -2 each time', () => {
                    const initialState = gridEditor.withMainContentUpTool;
                    const action = actions.applyActiveStyleTool(...cell, 'main');
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 'main', 'top', -2);

                    const secondState = reducer(nextState, action);
                    expectContentStyle(secondState, cell, 'main', 'top', -4);
                });

                it('moves main left by +2 each time', () => {
                    const initialState = gridEditor.withMainContentRightTool;
                    const action = actions.applyActiveStyleTool(...cell, 'main');
                    const nextState = reducer(initialState, action);
                    expectContentStyle(nextState, cell, 'main', 'left', 2);

                    const secondState = reducer(nextState, action);
                    expectContentStyle(secondState, cell, 'main', 'left', 4);
                });

                it('increases font size', () => {
                    const initialState = gridEditor.withFontIncreaseTool;
                    const action = actions.applyActiveStyleTool(...cell, 'main');
                    const nextState = reducer(initialState, action);

                    expect(getContentStyle(nextState, cell, 'main', 'fontSize'))
                        .to.be.greaterThan(defaults.contentFontSize('main'));
                });

                it('decreases mini font size', () => {
                    const initialState = gridEditor.withMiniFontDecreaseTool;
                    const action = actions.applyActiveStyleTool(...cell, 4);
                    const nextState = reducer(initialState, action);

                    expect(getContentStyle(nextState, cell, 4, 'fontSize'))
                        .to.be.lessThan(defaults.contentFontSize(4));
                });
            });
        });
    });
});
