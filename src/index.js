import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { GridEditorContainer } from './components/grid_editor';

import configureStore from './store/configureStore';

import gridEditor from './store/data/grid_editor';

// Add CSS files to bundle
require('./css/application.scss');
require('font-awesome-webpack');

const initialState = {
    gridEditor,
};

const store = configureStore(initialState);

if (process.env.NODE_ENV !== 'production') {
    const Perf = require('react-addons-perf');
    Perf.start();
    window.Perf = Perf;
}

ReactDOM.render(
    <Provider store={store}>
        <GridEditorContainer />
    </Provider>,
    document.getElementById('app')
);
