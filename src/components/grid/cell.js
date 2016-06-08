import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import { Map } from 'immutable';

export class Cell extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        const { row, col, style, content, clickHandler, mode } = this.props;
        return (
            <div
                className="grid-cell"
                style={style.toJS()}
                onClick={() => { if (mode === "cell") clickHandler(row, col); }}
            >
                {content.map((value, key) => (
                    <div
                        className={`cell-content cell-content-${key}`}
                        key={key}
                    >
                        {''}
                    </div>
                )).toArray()}
                {[0, 1, 2, 3].map((value) => (
                    <div
                        key={value}
                        className={`border-edit border-edit-${value}`}
                        onClick={() => { if (mode === 'border') clickHandler(row, col, value); }}
                    />
                ))}
            </div>
        );
    }
}

Cell.propTypes = {
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    style: React.PropTypes.instanceOf(Map).isRequired,
    content: React.PropTypes.instanceOf(Map).isRequired,
    clickHandler: React.PropTypes.func,
    mode: React.PropTypes.string,
};
