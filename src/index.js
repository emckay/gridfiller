import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/app';

import configureStore from './store/configureStore';

import gridEditor from './store/data/grid_editor';

// Add CSS files to bundle
require('../src/css/application.scss');
require('font-awesome-webpack');

const initialState = {
    gridEditor,
};

const store = configureStore(initialState);

// Render application to DOM
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
