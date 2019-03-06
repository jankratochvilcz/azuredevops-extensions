import { RECEIVE_TEAM } from "../actions";

const onReceiveTeam = (state, action) => {
    const { teamId } = action;

    return [
        ...state,
        teamId
    ];
};

const team = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_TEAM:
            return onReceiveTeam(state, action);
        default:
            return state;
    }
};

export default team;
