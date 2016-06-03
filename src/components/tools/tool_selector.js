import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import actions from '../../actions/action_creators';
import { ToolIcon } from './tool_icon';

export const ToolSelector = ({ tools, activeStyleTool, setActiveStyleTool }) => {
    return (
        <div className="tool-selector">
            {tools.map((tool) => {
                return (
                    <ToolIcon
                        key={tool.get('name')}
                        tool={tool}
                        clickHandler={setActiveStyleTool}
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
    setActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        tools: state.gridEditor.getIn(['tools', 'availableTools']),
        activeStyleTool: state.gridEditor.getIn(['tools', 'activeStyleTool']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveStyleTool: (tool) => {
            dispatch(actions.setActiveStyleTool(tool));
        },
    };
};

export const ToolSelectorContainer =
    connect(mapStateToProps, mapDispatchToProps)(ToolSelector);
