import { createStore, compose } from 'redux';
import reducer from '../reducers/reducer';

export default function (initialState) {
    const store = createStore(
        reducer,
        initialState,
        compose(
            window.devToolsExtension ?
                window.devToolsExtension() : f => { return f; }
        )
    );

    return store;
}
