import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import map from 'lodash/map';

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
            <div className="cell-wrapper">
                <div
                    className="grid-cell"
                    style={style}
                    onClick={() => { if (mode === 'cell' || mode === 'clear') clickHandler(row, col); }}
                    onMouseEnter={(e) => {
                        if ((mode === 'cell' || mode === 'clear') && e.buttons === 1) {
                            clickHandler(row, col);
                        }
                    }}
                >
                    <div className="content-wrapper">
                        {map(content, ((contentObj, key) => (
                            <div
                                className={contentClasses(key, activeContentId)}
                                key={key}
                                onClick={() => {
                                    if (mode === 'mini-content' || mode === 'main-content') {
                                        contentToggleHandler(row, col, key);
                                    } else if (mode === 'mini-content-style'
                                        || mode === 'main-content-style') {
                                        clickHandler(row, col, key);
                                    }
                                }}
                                style={contentObj.style}
                            >
                                {contentObj.text}
                            </div>
                        )))}
                    </div>
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
            </div>
        );
    }
}

Cell.propTypes = {
    row: React.PropTypes.number,
    col: React.PropTypes.number,
    style: React.PropTypes.object.isRequired,
    content: React.PropTypes.object.isRequired,
    clickHandler: React.PropTypes.func,
    contentToggleHandler: React.PropTypes.func,
    mode: React.PropTypes.string,
    activeContentId: React.PropTypes.string,
};
