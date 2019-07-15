import _ from "underscore";

import {
    RECEIVE_WORKITEMS,
    RECEIVE_WORKITEM_UPDATE,
    RECEIVE_WORKITEM_COMMENTS,
    REQUEST_WORKITEM_ADD_COMMENT
} from "../actions/devops";
import { mergeArraysUsingId } from "./infrastructure/merging";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

const onReceiveWorkItems = (state, action) => (
    mergeArraysUsingId(state, action.workItems));

const onReceiveComments = (state, action) => state.map(x => (x.id === action.workItemId
    ? {
        ...x,
        comments: action.comments,
        commentsFetched: true,
        addingComment: false
    }
    : x));

const onRequestWorkItemAddComment = (state, action) => state.map(x => (x.id === action.workItemId
    ? { ...x, addingComment: true }
    : x));

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
        case RECEIVE_WORKITEM_COMMENTS:
            return onReceiveComments(state, action);
        case REQUEST_WORKITEM_ADD_COMMENT:
            return onRequestWorkItemAddComment(state, action);
        case RECEIVE_SPRINT_ESTIMATION_UPDATE:
            return onReceiveSprintEstimationUpdate(state, action);
        default:
            return state;
    }
};

export default workItem;
