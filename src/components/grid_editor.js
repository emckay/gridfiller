import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autofill } from 'redux-form';

import { ActionCreators as UndoActions } from 'redux-undo';

import actions from '../actions';

import { GridContainer } from './grid/grid.js';
import { Tools } from './tools/tools.js';
import { CellContentFormContainer } from './cell_content_form';

export class GridEditor extends React.Component {
    componentDidMount() {
        this.swapColors = this.swapColorsIfShift.bind(this);
        this.undoRedo = this.undoRedo.bind(this);
        this.moveActiveCellContent = this.moveActiveCellContent.bind(this);
        window.addEventListener('keydown', this.swapColors);
        window.addEventListener('keyup', this.swapColors);
        window.addEventListener('keydown', this.undoRedo);
        window.addEventListener('keydown', this.moveActiveCellContent);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.swapColors);
        window.removeEventListener('keyup', this.swapColors);
        window.removeEventListener('keydown', this.undoRedo);
        window.removeEventListener('keydown', this.moveActiveCellContent);
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
    moveActiveCellContent(e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            let direction = e.keyCode - 38;
            if (direction < 0) direction += 4;
            this.props.moveActive(direction);
        }
    }
    render() {
        return (
            <div className="app">
                <Link to="/settings">Settings</Link>
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
    moveActive: React.PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
    swapColors: () => {
        dispatch(actions.swapColors());
    },
    moveActive: (direction) => {
        dispatch(actions.moveActiveCellContent(direction));
        dispatch(autofill('content', 'content', ''));
        document.getElementById('content_field').focus();
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
