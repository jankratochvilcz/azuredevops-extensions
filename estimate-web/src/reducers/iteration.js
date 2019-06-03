import _ from "underscore";

import { RECEIVE_ITERATIONS, REQUEST_WORKITEMS, RECEIVE_WORKITEMS } from "../actions/devops";
import { mergeArraysUsingId } from "./infrastructure/merging";

const onReceiveIterations = (state, action) => (
    mergeArraysUsingId(state, action.iterations.map(x => ({
        ...x,
        workItemsLoading: false
    }))));

const onWorkItemsLoading = (state, action, loading) => {
    const targetIteration = _.find(state, x => x.path === action.iterationPath);

    if (!targetIteration) return state;

    const targetIterationWithLoading = {
        ...targetIteration,
        workItemsLoading: loading
    };

    return mergeArraysUsingId(
        state,
        [targetIterationWithLoading]
    );
};

const iteration = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_ITERATIONS:
            return onReceiveIterations(state, action);
        case REQUEST_WORKITEMS:
            return onWorkItemsLoading(state, action, true);
        case RECEIVE_WORKITEMS:
            return onWorkItemsLoading(state, action, false);
        default:
            return state;
    }
};

export default iteration;
