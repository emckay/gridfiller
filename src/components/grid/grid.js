import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';
import { autofill } from 'redux-form';

import actions from '../../actions';
import selectors from '../../selectors';

import { Cell } from './cell';

export class Grid extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        const { activeCellContent = {} } = this.props;

        return (
            <div className={`grid ${this.props.mode}-mode`}>
                {this.props.rows.map((row, i) => (
                    <div key={i} className="grid-row">
                        {row.map((cell, j) => (
                            <Cell
                                key={`${row}-${j}`}
                                row={i}
                                col={j}
                                mode={this.props.mode}
                                clickHandler={this.props.applyActiveStyleTool}
                                contentToggleHandler={this.props.toggleActiveCellContent}
                                activeContentId={
                                    i === activeCellContent.row && j === activeCellContent.col ?
                                    activeCellContent.contentId :
                                    undefined
                                }
                                {...cell}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
Grid.propTypes = {
    rows: React.PropTypes.array.isRequired,
    applyActiveStyleTool: React.PropTypes.func,
    toggleActiveCellContent: React.PropTypes.func,
    mode: React.PropTypes.string.isRequired,
    activeCellContent: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
    rows: selectors.getCells(state),
    mode: (selectors.getMode(state) || '').toLowerCase(),
    activeCellContent: selectors.getActiveCellContent(state),
});

const mapDispatchToProps = (dispatch) => ({
    applyActiveStyleTool: (row, col, target) => {
        dispatch(actions.applyActiveStyleTool(row, col, target));
    },
    toggleActiveCellContent: (row, col, target) => {
        dispatch(actions.toggleActiveCellContent(row, col, target));
        dispatch(autofill('content', 'content', ''));
        document.getElementById('content_field').focus();
    },
});

export const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);
