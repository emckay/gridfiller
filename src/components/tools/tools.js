import React from 'react';

import { ToolSelectorContainer } from './tool_selector.js';
import { SharedOptionsContainer } from './shared_options.js';

export const Tools = () => {
    return (
        <div className="tools">
            <SharedOptionsContainer />
            <ToolSelectorContainer />
        </div>
    );
};
