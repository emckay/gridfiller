import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';

import { Cell } from './cell';

export class Grid extends React.Component {
    render() {
        return (
            <div className="grid">
                {this.props.rows.map((row, i) => {
                    return (
                        <div key={i} className="grid-row">
                            {row.map((cell, j) => {
                                return (
                                    <Cell
                                        key={`${row}-${j}`}
                                        row={i}
                                        col={j}
                                        clickHandler={this.props.applyActiveStyleTool}
                                        {...cell.toObject()}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}
Grid.propTypes = {
    rows: React.PropTypes.instanceOf(List).isRequired,
    applyActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        rows: state.gridEditor.getIn(['grid', 'cells']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        applyActiveStyleTool: (row, col) => {
            dispatch(actions.applyActiveStyleTool(row, col));
        },
    };
};

export const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);
