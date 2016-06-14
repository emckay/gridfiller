import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import { GridEditorContainer } from './components/grid_editor';
import { SettingsContainer } from './components/settings';

import configureStore from './store/configureStore';

import gridEditor from './store/data/grid_editor';

require('material-design-icons');
require('font-awesome-webpack');
require('./css/application.scss');

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
        <Router history={browserHistory}>
            <Route path="/" component={GridEditorContainer} />
            <Route path="/settings" component={SettingsContainer} />
        </Router>
    </Provider>,
    document.getElementById('app')
);
