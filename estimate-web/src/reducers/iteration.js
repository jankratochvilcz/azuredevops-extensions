import { RECEIVE_ITERATIONS } from "../actions";
import { mergeArraysUsingId } from "./infrastructure/merging";

const onReceiveIterations = (state, action) => (
    mergeArraysUsingId(state, action.iterations));

const iteration = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_ITERATIONS:
            return onReceiveIterations(state, action);
        default:
            return state;
    }
};

export default iteration;
