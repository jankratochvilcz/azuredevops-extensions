import _ from "underscore";

import { RECEIVE_WORKITEMS, RECEIVE_WORKITEM_UPDATE, RECEIVE_WORKITEM_COMMENTS } from "../actions/devops";
import { mergeArraysUsingId } from "./infrastructure/merging";
import { RECEIVE_WORKITEM_SCORED } from "../actions/estimation";

const onReceiveWorkItems = (state, action) => (
    mergeArraysUsingId(state, action.workItems));

const onReceiveComments = (state, action) => state.map(x => (x.id === action.workItemId
    ? { ...x, comments: action.comments, commentsFetched: true }
    : x));

const onReceiveWorkItemUpdate = (state, action) => (
    mergeArraysUsingId(state, [action.workItem]));

const onReceiveWorkItemScored = (state, action) => {
    const workItem = _.find(state, x => x.id === action.workItemId);

    if (!workItem) return state;

    const workItemWithUpdatedStoryPoints = {
        ...workItem,
        storyPoints: action.storyPoints
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
        case RECEIVE_WORKITEM_COMMENTS:
            return onReceiveComments(state, action);
        case RECEIVE_WORKITEM_SCORED:
            return onReceiveWorkItemScored(state, action);
        default:
            return state;
    }
};

export default workItem;
