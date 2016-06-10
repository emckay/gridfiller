import React from 'react';
import { connect } from 'react-redux';

import { ActionCreators as UndoActions } from 'redux-undo';

import actions from '../actions/action_creators';

import { GridContainer } from './grid/grid.js';
import { Tools } from './tools/tools.js';
import { CellContentFormContainer } from './cell_content_form';

export class GridEditor extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.swapColorsIfShift.bind(this));
        window.addEventListener('keyup', this.swapColorsIfShift.bind(this));
        window.addEventListener('keydown', this.undoRedo.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.swapColorsIfShift.bind(this));
        window.removeEventListener('keyup', this.swapColorsIfShift.bind(this));
        window.addEventListener('keydown', this.undoRedo.bind(this));
    }
    swapColorsIfShift(e) {
        if (e.keyCode === 16 && !e.ctrlKey) {
            this.props.swapColors();
        }
    }
    undoRedo(e) {
        if (
            e.keyCode === 90 && e.ctrlKey && e.shiftKey ||
            e.keyCode === 89 && e.ctrlKey
        ) {
            this.props.redo();
        } else if (e.keyCode === 90 && e.ctrlKey) {
            this.props.undo();
        }
    }
    render() {
        return (
            <div className="app">
                <h1>Grid Filler</h1>
                <CellContentFormContainer />
                <div className="editor">
                    <GridContainer />
                    <Tools />
                </div>
            </div>
        );
    }
}

GridEditor.propTypes = {
    swapColors: React.PropTypes.func,
    undo: React.PropTypes.func,
    redo: React.PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    swapColors: () => {
        dispatch(actions.swapColors());
    },
    undo: () => {
        dispatch(UndoActions.undo());
    },
    redo: () => {
        dispatch(UndoActions.redo());
    },
});

export const GridEditorContainer =
    connect(undefined, mapDispatchToProps)(GridEditor);
