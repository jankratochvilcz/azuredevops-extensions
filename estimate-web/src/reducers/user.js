import _ from "underscore";

import { RECEIVE_TEAM } from "../actions";
import { mergeArraysUsingId } from "./infrastructure/merging";
import { RECEIVE_GROUP_UPDATED } from "../actions/estimation";

const onReceiveTeam = (state, action) => (
    mergeArraysUsingId(state, action.team));

const onReceiveGroupUpdated = (state, action) => {
    const { connectedUserIds } = action;

    return state.map(user => ({
        ...user,
        isConnected: _.some(connectedUserIds, x => x === user.id)
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
        default:
            return state;
    }
};

export default user;
