import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { autofill } from 'redux-form';

import actions from '../../actions/action_creators';
import * as selectors from '../../selectors';

import { Cell } from './cell';

export class Grid extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        let activeContent = [-1, -1];
        let activeContentId;

        if (this.props.activeCellContent !== undefined) {
            activeContent = [this.props.activeCellContent.get('row'),
                this.props.activeCellContent.get('col')];
            activeContentId = this.props.activeCellContent.get('contentId');
        }

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
                                    i === activeContent[0] && j === activeContent[1] ?
                                    activeContentId :
                                    undefined
                                }
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
    toggleActiveCellContent: React.PropTypes.func,
    mode: React.PropTypes.string.isRequired,
    activeCellContent: React.PropTypes.instanceOf(Map),
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
    toggleActiveCellContent: (row, col, target, currentContent) => {
        dispatch(actions.toggleActiveCellContent(row, col, target));
        dispatch(autofill('content', 'content', currentContent));
        document.getElementById('content_field').focus();
    },
});

export const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);
