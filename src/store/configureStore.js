/* eslint-disable global-require */
import { createStore, compose } from 'redux';
import reducer from '../reducers/reducer';

export default function (initialState) {
    const store = createStore(
        reducer,
        initialState,
        compose(
            (f) => { return f; },
            window.devToolsExtension ?
                window.devToolsExtension() : f => { return f; }
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/reducer', () => {
            const nextRootReducer = require('../reducers/reducer').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
/* eslint-enable global-require */
