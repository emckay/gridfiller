import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import { Map } from 'immutable';

export class Cell extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        const {
            row,
            col,
            style,
            content,
            clickHandler,
            contentToggleHandler,
            mode,
            activeContentId,
        } = this.props;

        const contentClasses = (key, activeId) => {
            const active = activeId === key ? 'active' : '';
            return `cell-content cell-content-${key} ${active}`;
        };

        return (
            <div
                className="grid-cell"
                style={style.toJS()}
                onClick={() => { if (mode === 'cell') clickHandler(row, col); }}
                onMouseEnter={(e) => {
                    if (mode === 'cell' && e.buttons === 1) clickHandler(row, col);
                }}
            >
                {content.map((contentObj, key) => (
                    <div
                        className={contentClasses(key, activeContentId)}
                        key={key}
                        onClick={() => {
                            if (mode === 'mini-content' || mode === 'main-content') {
                                contentToggleHandler(row, col, key, contentObj.get('text'));
                            } else if (mode === 'mini-content-style'
                                || mode === 'main-content-style') {
                                clickHandler(row, col, key);
                            }
                        }}
                        style={contentObj.get('style').toJS()}
                    >
                        {contentObj.get('text')}
                    </div>
                )).toArray()}

                {[0, 1, 2, 3].map((value) => (
                    <div
                        key={value}
                        className={`border-edit border-edit-${value}`}
                        onClick={() => {
                            if (mode === 'single-border') clickHandler(row, col, value);
                        }}
                        onMouseEnter={(e) => {
                            if (mode === 'single-border' && e.buttons === 1) {
                                clickHandler(row, col, value);
                            }
                        }}
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
    contentToggleHandler: React.PropTypes.func,
    mode: React.PropTypes.string,
    activeContentId: React.PropTypes.string,
};
