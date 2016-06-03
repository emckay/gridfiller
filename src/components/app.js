import React from 'react';

import { GridContainer } from './grid/grid.js';

export class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>My Application</h1>
                <GridContainer />
            </div>
        );
    }
}
