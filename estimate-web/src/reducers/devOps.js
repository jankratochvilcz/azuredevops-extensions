import _ from "underscore";

import {
    INITIALIZE_CONTEXT,
    RECEIVE_ITERATIONS,
    RECEIVE_TEAM,
    RECEIVE_WORKITEMS
} from "../actions";

import { RECEIVE_GROUP_UPDATED, RECEIVE_VOTE } from "../actions/estimation";

function onReceiveGroupUpdated(state, action) {
    const teamsAsArray = Object.keys(state.teams).map(teamId => {
        const teamAltered = state.teams[teamId].map(user => ({
            ...user,
            connected: _.some(action.connectedUserIds, userId => user.id == userId)
        }));
        return {
            key: teamId,
            value: teamAltered
        };
    });
    const teamsAltered = {};
    teamsAsArray
        .forEach(x => teamsAltered[x.key] = x.value);
    return {
        ...state,
        teams: teamsAltered
    };
}

const devOps = (state = {
    context: null,
    teams: {},
    workItems: {}
}, action) => {
    switch (action.type) {
        case INITIALIZE_CONTEXT:
            return {
                ...state,
                context: action.context
            };
        case RECEIVE_ITERATIONS:
            return {
                ...state,
                iterations: action.iterations
            };
        case RECEIVE_TEAM:
            return {
                ...state,
                teams: {
                    ...state.teams,
                    [action.teamId]: action.team
                }
            };
        case RECEIVE_WORKITEMS:
            return {
                ...state,
                workItems: {
                    ...state.workItems,
                    [action.iterationPath]: action.workItems
                }
            };
        case RECEIVE_GROUP_UPDATED:
            return onReceiveGroupUpdated(state, action);
        case RECEIVE_VOTE:
            break;
        default:
            return state;
    }
};

export default devOps;
