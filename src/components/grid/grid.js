import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { List } from 'immutable';
import { connect } from 'react-redux';

import actions from '../../actions/action_creators';
import * as selectors from '../../selectors';

import { Cell } from './cell';

export class Grid extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        return (
            <div className="grid">
                {this.props.rows.map((row, i) => (
                    <div key={i} className="grid-row">
                        {row.map((cell, j) => (
                            <Cell
                                key={`${row}-${j}`}
                                row={i}
                                col={j}
                                clickHandler={this.props.applyActiveStyleTool}
                                {...cell.toObject()}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
Grid.propTypes = {
    rows: React.PropTypes.instanceOf(List).isRequired,
    applyActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    rows: selectors.getCells(state),
});

const mapDispatchToProps = (dispatch) => ({
    applyActiveStyleTool: (row, col) => {
        dispatch(actions.applyActiveStyleTool(row, col));
    },
});

export const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);
