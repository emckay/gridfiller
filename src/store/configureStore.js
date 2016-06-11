import { createStore, compose } from 'redux';
import reducer from '../reducers/reducer';

export default function (initialState) {
    const store = createStore(
        reducer,
        initialState,
        compose(
            process.env.NODE_ENV !== 'production' && window.devToolsExtension ?
                window.devToolsExtension() : f => f
        )
    );

    return store;
}
