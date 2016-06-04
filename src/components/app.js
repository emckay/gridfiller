import React from 'react';

import { GridContainer } from './grid/grid.js';
import { ToolSelectorContainer } from './tools/tool_selector.js';
import { SharedOptionsContainer } from './tools/shared_options.js';

export class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>My Application</h1>
                <GridContainer />
                <SharedOptionsContainer />
                <ToolSelectorContainer />
            </div>
        );
    }
}
