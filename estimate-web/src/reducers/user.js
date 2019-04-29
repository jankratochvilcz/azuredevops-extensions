import _ from "underscore";

import { RECEIVE_TEAM } from "../actions/devops";
import { mergeArraysUsingId } from "./infrastructure/merging";
import { RECEIVE_GROUP_UPDATED } from "../actions/estimation";
import { STATUS_CHANGED } from "../actions/connection";

const onReceiveTeam = (state, action) => (
    mergeArraysUsingId(state, action.team));

const onReceiveGroupUpdated = (state, action) => {
    const { connectedUserIds } = action;

    return state.map(user => ({
        ...user,
        isConnected: _.some(connectedUserIds, x => x === user.id)
    }));
};

const onStatusChanged = (state, action) => {
    if (!action.isDisconnected) {
        return state;
    }

    return state.map(x => ({
        ...x,
        isConnected: false
    }));
};

const user = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_TEAM:
            return onReceiveTeam(state, action);
        case RECEIVE_GROUP_UPDATED:
            return onReceiveGroupUpdated(state, action);
        case STATUS_CHANGED:
            return onStatusChanged(state, action);
        default:
            return state;
    }
};

export default user;
