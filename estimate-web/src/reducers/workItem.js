import _ from "underscore";

import { RECEIVE_WORKITEMS, RECEIVE_WORKITEM_UPDATE } from "../actions/devops";
import { mergeArraysUsingId } from "./infrastructure/merging";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

const onReceiveWorkItems = (state, action) => (
    mergeArraysUsingId(state, action.workItems));

const onReceiveWorkItemUpdate = (state, action) => (
    mergeArraysUsingId(state, [action.workItem]));

const onReceiveSprintEstimationUpdate = (state, { activeWorkItemId, comittedNumericalScore }) => {
    if (!comittedNumericalScore) {
        return state;
    }

    const workItem = _.find(state, x => x.id === activeWorkItemId);

    if (!workItem) return state;

    const workItemWithUpdatedStoryPoints = {
        ...workItem,
        storyPoints: comittedNumericalScore
    };

    return mergeArraysUsingId(state, [workItemWithUpdatedStoryPoints]);
};

const workItem = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_WORKITEMS:
            return onReceiveWorkItems(state, action);
        case RECEIVE_WORKITEM_UPDATE:
            return onReceiveWorkItemUpdate(state, action);
        case RECEIVE_SPRINT_ESTIMATION_UPDATE:
            return onReceiveSprintEstimationUpdate(state, action);
        default:
            return state;
    }
};

export default workItem;
