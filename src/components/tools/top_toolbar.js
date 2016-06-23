import React from 'react';
import { connect } from 'react-redux';

import selectors from '../../selectors';

import { CellContentFormContainer } from './cell_content_form';
import { ToolIcon } from './tool_icon';

export const TopToolbar = ({ tools, actionToolHandler }) => (
    <div className="top-toolbar">
        <CellContentFormContainer />
        <div className="top-tools">
            {tools.map((tool) => (
                <ToolIcon
                    key={tool.name}
                    tool={tool}
                    clickHandler={actionToolHandler}
                />
            ))}
        </div>
    </div>
);

TopToolbar.propTypes = {
    tools: React.PropTypes.array.isRequired,
    actionToolHandler: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
    tools: selectors.getTopTools(state),
});

const mapDispatchToProps = (dispatch) => ({
    actionToolHandler: (tool) => dispatch(tool.action),
});

export const TopToolbarContainer =
    connect(mapStateToProps, mapDispatchToProps)(TopToolbar);
