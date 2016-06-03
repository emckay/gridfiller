import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { fromJS } from 'immutable';
import cloner from 'cloner';

import { App } from './components/app';

import configureStore from './store/configureStore';

// Add CSS files to bundle
require('../src/css/application.scss');

const cell = { content: '0', style: {} };

const grid = [];

for (let i = 0; i < 10; i++) {
    grid.push([]);
    for (let j = 0; j < 10; j++) {
        grid[grid.length - 1].push(cloner.deep.copy(cell));
    }
}

const initialState = { grid: fromJS({ cells: grid }) };

const store = configureStore(initialState);

// Render application to DOM
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
