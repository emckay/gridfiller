import React from 'react';
import { Map } from 'immutable';

export const Cell = ({ row, col, style, content, clickHandler }) => {
    return (
        <div
            className="grid-cell"
            style={style.toJS()}
            onClick={() => { clickHandler(row, col); }}
        >
            {content.map((value, key) => {
                return (
                    <div
                        className={`cell-content cell-content-${key}`}
                        key={key}
                    >
                        {''}
                    </div>
                );
            }).toArray()}
        </div>
    );
};

Cell.propTypes = {
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    style: React.PropTypes.instanceOf(Map).isRequired,
    content: React.PropTypes.instanceOf(Map).isRequired,
    clickHandler: React.PropTypes.func,
};
