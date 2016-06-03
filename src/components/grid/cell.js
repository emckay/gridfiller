import React from 'react';
import { Map } from 'immutable';

export const Cell = ({ row, col, style }) => {
    return (
        <div className="grid-cell" style={style.toJS()}>
            {row * col}
        </div>
    );
};

Cell.propTypes = {
    row: React.PropTypes.number.isRequired,
    col: React.PropTypes.number.isRequired,
    style: React.PropTypes.instanceOf(Map).isRequired,
};
