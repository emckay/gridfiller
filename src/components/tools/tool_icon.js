import React from 'react';

export const ToolIcon = ({ tool, active, clickHandler, mode, icon, iconClass }) => (
    <div
        className={`tool-icon ${active ? 'active' : ''} ${iconClass}`}
        onClick={() => { clickHandler(tool, mode); }}
    >
        {icon}
    </div>
);

ToolIcon.propTypes = {
    tool: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool,
    clickHandler: React.PropTypes.func,
    mode: React.PropTypes.string,
    icon: React.PropTypes.object,
    iconClass: React.PropTypes.string,
};
