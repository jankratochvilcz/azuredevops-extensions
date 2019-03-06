import { mergeArrays } from "./infrastructure/merging";
import { RECEIVE_VOTE, RECEIVE_ACTIVEWORKITEM_CHANGED } from "../actions/estimation";

const onReceiveVote = (state, action) => (
    mergeArrays(state, [{
        workItemId: action.workItemId,
        userId: action.userId,
        value: action.value
    }], (x, y) => x.workItemId === y.workItemId && x.userId === y.userId));

const onReceiveActiveWorkItemChanged = (state, action) => (
    state.filter(x => x.workItemId !== action.workItemId));

const vote = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_VOTE:
            return onReceiveVote(state, action);
        case RECEIVE_ACTIVEWORKITEM_CHANGED:
            return onReceiveActiveWorkItemChanged(state, action);
        default:
            return state;
    }
};

export default vote;
