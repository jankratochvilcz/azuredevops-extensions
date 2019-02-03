import { combineReducers } from 'redux'
import { INITIALIZE_CONTEXT, REQUEST_ITERATIONS, RECEIVE_ITERATIONS } from '../actions'

const devOps = (state = {
    context: null
}, action) => {
    switch (action.type) {
        case INITIALIZE_CONTEXT:
            return {
                ...state,
                context: action.context
            };
        case REQUEST_ITERATIONS:
            return state;
        case RECEIVE_ITERATIONS:
        return {
            ...state,
            iterations: action.iterations
        }
        default:
            return state;
    }
}

const enums = (state = {
    cardDecks: [
        {
            key: "fibonacci",
            name: "Fibonacci sequence",
            about: "The available values are 0, 1, 2, 3, 5, 8, 13, 21. The fibonacci sequence is great at reflecting the inherent uncertainty when estimating larger items."
        }
    ]
}, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    devOps,
    enums
});

export default rootReducer;