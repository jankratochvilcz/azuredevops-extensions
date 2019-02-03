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

const rootReducer = combineReducers({
    devOps
});

export default rootReducer;