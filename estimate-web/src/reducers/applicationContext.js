import { STATUS_CHANGED } from "../actions/connection";
import { INITIALIZE_CONTEXT } from "../actions/devops";
import {
    RECEIVE_ACTIVEWORKITEM_CHANGED,
    RECEIVE_VOTES_REVEALED,
    RECEIVE_GROUP_UPDATED,
    SELECTED_WORK_ITEM_CHANGED
} from "../actions/estimation";

const onStatusChanged = (state, action) => {
    const isConnecting = "isConnecting" in action ? action.isConnecting : state.isConnecting;
    const isDisconnected = ("isDisconnected" in action ? action.isDisconnected : state.isDisconnected) || false;

    return {
        ...state,
        isConnecting,
        isDisconnected
    };
};

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

const onSelectedWorkItemChanged = (state, action) => ({
    ...state,
    selectedWorkItemId: action.selectedWorkItemId
});

const applicationContext = (state = {
    isConnecting: false,
    isDisconnected: false,
    userId: null,
    teamId: null,
    teamName: null,
    projectId: null,
    projectName: null,
    collectionUri: null,
    activeWorkItemId: null,
    selectedWorkItemId: null,
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
        case SELECTED_WORK_ITEM_CHANGED:
            return onSelectedWorkItemChanged(state, action);
        default:
            return state;
    }
};

export default applicationContext;
