import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import actions from '../../actions/action_creators';
import * as selectors from '../../selectors';
import { ToolIcon } from './tool_icon';

export const ToolSelector = ({ tools, activeStyleTool, toggleActiveStyleTool }) => (
    <div className="tool-selector">
        {tools.map((tool) => (
            <ToolIcon
                key={tool.get('name')}
                tool={tool}
                clickHandler={toggleActiveStyleTool}
                active={tool === activeStyleTool}
            />
        ))}
    </div>
);

ToolSelector.propTypes = {
    tools: React.PropTypes.instanceOf(List).isRequired,
    activeStyleTool: React.PropTypes.object,
    toggleActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    tools: selectors.getAvailableTools(state),
    activeStyleTool: selectors.getActiveStyleTool(state),
});

const mapDispatchToProps = (dispatch) => ({
    toggleActiveStyleTool: (tool) => {
        dispatch(actions.toggleActiveStyleTool(tool));
    },
});

export const ToolSelectorContainer =
    connect(mapStateToProps, mapDispatchToProps)(ToolSelector);
