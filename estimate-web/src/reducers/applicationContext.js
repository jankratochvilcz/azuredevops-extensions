import { STATUS_CHANGED } from "../actions/connection";
import { INITIALIZE_CONTEXT } from "../actions";
import { RECEIVE_ACTIVEWORKITEM_CHANGED, RECEIVE_VOTES_REVEALED, RECEIVE_GROUP_UPDATED } from "../actions/estimation";

const onStatusChanged = (state, action) => ({
    ...state,
    isConnecting: "isConnecting" in action ? action.isConnecting : state.isConnecting,
    isDisconnected: "isDisconnected" in action ? action.isDisconnected : state.isDisconnected
});

const onInitializeContext = (state, action) => ({
    ...state,
    ...action.context
});

const onReceiveActiveWorkItemChanged = (state, action) => {
    if (action.workItemId === state.activeWorkItemId) {
        return state;
    }

    return {
        ...state,
        activeWorkItemId: action.workItemId,
        isActiveWorkItemRevealed: false
    };
};

const onReceiveVotesRevealed = (state, action) => {
    if (action.workItemId !== state.activeWorkItemId) {
        return state;
    }

    return {
        ...state,
        isActiveWorkItemRevealed: true
    };
};

const onReceiveGroupUpdated = (state, action) => ({
    ...state,
    isConnecting: false,
    isDisconnected: false,
    activeWorkItemId: action.activeWorkItemId
});

const applicationContext = (state = {
    isConnecting: false,
    userId: null,
    teamId: null,
    teamName: null,
    projectId: null,
    projectName: null,
    collectionUri: null,
    activeWorkItemId: null,
    isActiveWorkItemRevealed: false
}, action) => {
    switch (action.type) {
        case STATUS_CHANGED:
            return onStatusChanged(state, action);
        case RECEIVE_GROUP_UPDATED:
            return onReceiveGroupUpdated(state, action);
        case INITIALIZE_CONTEXT:
            return onInitializeContext(state, action);
        case RECEIVE_ACTIVEWORKITEM_CHANGED:
            return onReceiveActiveWorkItemChanged(state, action);
        case RECEIVE_VOTES_REVEALED:
            return onReceiveVotesRevealed(state, action);
        default:
            return state;
    }
};

export default applicationContext;
