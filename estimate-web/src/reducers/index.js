import { combineReducers } from 'redux'
import { INITIALIZE_CONTEXT } from '../actions'

const devOps = (state = {
    context: null
}, action) => {
    switch (action.type) {
        case INITIALIZE_CONTEXT:
            return {
                ...state,
                context: action.context
            };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    devOps
});

export default rootReducer;