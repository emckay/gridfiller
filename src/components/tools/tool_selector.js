import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';
import selectors from '../../selectors';
import { ToolIcon } from './tool_icon';

export const ToolSelector = ({ tools, activeStyleTool, toggleActiveStyleTool }) => {
    const icon = (toolOrGroup) => {
        if (toolOrGroup.fontAwesome !== undefined) {
            return <i className={`fa fa-${toolOrGroup.fontAwesome}`} />;
        }

        return <i className="material-icons">{toolOrGroup.materialIcon}</i>;
    };

    return (
        <div className="tool-selector">
            {tools.map((group) => (
                <div className="tool-group" key={group.name}>
                    <div className="tool-group-header">
                        {icon(group)}
                        {group.name}
                    </div>
                    {group.tools.map((tool) => (
                        <ToolIcon
                            key={tool.name}
                            tool={tool}
                            clickHandler={toggleActiveStyleTool}
                            active={tool === activeStyleTool}
                            icon={icon(tool)}
                            iconClass={tool.iconClass || ''}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

ToolSelector.propTypes = {
    tools: React.PropTypes.array.isRequired,
    activeStyleTool: React.PropTypes.object,
    toggleActiveStyleTool: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    tools: selectors.getAvailableTools(state),
    activeStyleTool: selectors.getActiveStyleTool(state),
});

const mapDispatchToProps = (dispatch) => ({
    toggleActiveStyleTool: (tool, mode) => {
        dispatch(actions.toggleActiveStyleTool(tool, mode));
    },
});

export const ToolSelectorContainer =
    connect(mapStateToProps, mapDispatchToProps)(ToolSelector);
