import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import actions from '../../actions/action_creators';
import * as selectors from '../../selectors';
import { ToolIcon } from './tool_icon';

export const ToolSelector = ({ tools, activeStyleTool, toggleActiveStyleTool }) => {
    const icon = (toolOrGroup) => {
        if (toolOrGroup.get('fontAwesome') !== undefined) {
            return <i className={`fa fa-${toolOrGroup.get('fontAwesome')}`} />;
        }

        return <i className="material-icons">{toolOrGroup.get('materialIcon')}</i>;
    };

    return (
        <div className="tool-selector">
            {tools.map((group) => (
                <div className="tool-group" key={group.get('name')}>
                    <div className="tool-group-header">
                        {icon(group)}
                        {group.get('name')}
                    </div>
                    {group.get('tools').map((tool) => (
                        <ToolIcon
                            key={tool.get('name')}
                            tool={tool}
                            clickHandler={toggleActiveStyleTool}
                            active={tool === activeStyleTool}
                            icon={icon(tool)}
                            iconClass={tool.get('iconClass') || ''}
                            mode={group.get('name')}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

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
    toggleActiveStyleTool: (tool, mode) => {
        dispatch(actions.toggleActiveStyleTool(tool, mode));
    },
});

export const ToolSelectorContainer =
    connect(mapStateToProps, mapDispatchToProps)(ToolSelector);
