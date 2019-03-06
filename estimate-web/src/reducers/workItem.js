import { RECEIVE_WORKITEMS, RECEIVE_WORKITEM_UPDATE } from "../actions";
import { mergeArraysUsingId } from "./infrastructure/merging";

const onReceiveWorkItems = (state, action) => (
    mergeArraysUsingId(state, action.workItems));

const onReceiveWorkItemUpdate = (state, action) => (
    mergeArraysUsingId(state, [action.workItem]));

const workItem = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_WORKITEMS:
            return onReceiveWorkItems(state, action);
        case RECEIVE_WORKITEM_UPDATE:
            return onReceiveWorkItemUpdate(state, action);
        default:
            return state;
    }
};

export default workItem;
