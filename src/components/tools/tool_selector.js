import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import actions from '../../actions/action_creators';
import { ToolIcon } from './tool_icon';

export const ToolSelector = ({ tools, activeStyleTool, toggleActiveStyleTool }) => {
    return (
        <div className="tool-selector">
            {tools.map((tool) => {
                return (
                    <ToolIcon
                        key={tool.get('name')}
                        tool={tool}
                        clickHandler={toggleActiveStyleTool}
                        active={tool === activeStyleTool}
                    />
                );
            })}
        </div>
    );
};

ToolSelector.propTypes = {
    tools: React.PropTypes.instanceOf(List).isRequired,
    activeStyleTool: React.PropTypes.object,
    toggleActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        tools: state.gridEditor.getIn(['tools', 'availableTools']),
        activeStyleTool: state.gridEditor.getIn(['tools', 'activeStyleTool']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleActiveStyleTool: (tool) => {
            dispatch(actions.toggleActiveStyleTool(tool));
        },
    };
};

export const ToolSelectorContainer =
    connect(mapStateToProps, mapDispatchToProps)(ToolSelector);
