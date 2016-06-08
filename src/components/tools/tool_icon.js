import React from 'react';
import { Map } from 'immutable';

export const ToolIcon = ({ tool, active, clickHandler, mode }) => (
    <div
        className={`tool-icon ${active ? 'active' : ''}`}
        onClick={() => { clickHandler(tool, mode); }}
    >
        <i className={`fa fa-${tool.get('icon')}`} />
    </div>
);

ToolIcon.propTypes = {
    tool: React.PropTypes.instanceOf(Map).isRequired,
    active: React.PropTypes.bool,
    clickHandler: React.PropTypes.func,
    mode: React.PropTypes.string,
};
