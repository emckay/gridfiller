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
        const { activeCellContent = {}, gridId } = this.props;
        const isActive = (i, j) => (
            i === activeCellContent.row
            && j === activeCellContent.col
            && gridId === activeCellContent.gridId
        );
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
                                    isActive(i, j) ?
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
    gridId: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const rows = ownProps.rows || selectors.getCells(state);
    return {
        rows,
        mode: (selectors.getMode(state) || '').toLowerCase(),
        activeCellContent: selectors.getActiveCellContent(state),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    applyActiveStyleTool: (row, col, target) => {
        dispatch(actions.applyActiveStyleTool(row, col, { target, gridId: ownProps.gridId }));
    },
    toggleActiveCellContent: (row, col, target) => {
        dispatch(actions.toggleActiveCellContent(row, col, { contentId: target, gridId: ownProps.gridId }));
        dispatch(autofill('content', 'content', ''));
        document.getElementById('content_field').focus();
    },
});

export const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);
