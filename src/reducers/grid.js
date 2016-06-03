import { Map, fromJS } from 'immutable';

const handleSetStyle = (currentState, action) => {
    const temp = currentState.setIn(
        ['cells', action.row, action.col, 'style'],
        fromJS(action.style)
    );
    return temp;
};

export default function (currentState = new Map(), action) {
    switch (action.type) {
        case 'SET_STYLE':
            return handleSetStyle(currentState, action);
        default:
            return currentState;
    }
}
