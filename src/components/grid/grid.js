import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { Cell } from './cell';

const renderRow = (row, i) => {
    const cells = row.map((cell, j) => {
        return (
            <Cell
                key={`${row}-${j}`}
                row={i}
                col={j}
                {...cell.toObject()}
            />
        );
    });
    return (
        <div key={i} className="grid-row">
            {cells}
        </div>
    );
};

const renderGrid = (rows) => {
    return (
        <div className="grid">
            {rows.map((row, i) => {
                return renderRow(row, i);
            })}
        </div>
    );
};


export class Grid extends React.Component {
    render() {
        return renderGrid(this.props.rows);
    }
}
Grid.propTypes = {
    rows: React.PropTypes.instanceOf(List).isRequired,
};


const mapStateToProps = (state) => {
    return {
        rows: state.grid.get('cells'),
    };
};

export const GridContainer = connect(mapStateToProps)(Grid);
