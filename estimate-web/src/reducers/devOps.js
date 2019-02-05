import _ from "underscore"

import { INITIALIZE_CONTEXT, REQUEST_ITERATIONS, RECEIVE_ITERATIONS, RECEIVE_TEAM, RECEIVE_WORKITEMS } from '../actions'
import { RECEIVE_GROUP_UPDATED } from '../actions/estimation';

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
            const teamsAsArray = Object.keys(state.teams).map(teamId => {
                    var teamAltered = state.teams[teamId].map(user => ({
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
        default:
            return state;
    }
}

export default devOps;