import React from 'react';
import { icon } from '../../utils/icons';

export const ToolIcon = ({ tool, active, clickHandler, mode }) => (
    <div
        className={`tool-icon ${active ? 'active' : ''} ${tool.iconClass}`}
        onClick={() => { clickHandler(tool); }}
    >
        {icon(tool)}
    </div>
);

ToolIcon.propTypes = {
    tool: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool,
    clickHandler: React.PropTypes.func,
};
