import { STATUS_CHANGED } from "../actions/connection";
import { INITIALIZE_CONTEXT } from "../actions/devops";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

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

const onReceiveSprintEstimationUpdate = (
    state,
    { activeWorkItemId, isActiveWorkItemRevealed }
) => ({
    ...state,
    isConnecting: false,
    isDisconnected: false,
    activeWorkItemId,
    isActiveWorkItemRevealed
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
        case RECEIVE_SPRINT_ESTIMATION_UPDATE:
            return onReceiveSprintEstimationUpdate(state, action);
        case INITIALIZE_CONTEXT:
            return onInitializeContext(state, action);
        default:
            return state;
    }
};

export default applicationContext;
