import React from 'react';

import { GridContainer } from './grid/grid.js';
import { Tools } from './tools/tools.js';

export class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>My Application</h1>
                <div className="editor">
                    <GridContainer />
                    <Tools />
                </div>
            </div>
        );
    }
}
