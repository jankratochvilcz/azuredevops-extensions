import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

const onReceiveSprintEstimationUpdate = (state, { activeWorkItemId, activeWorkItemScores }) => (
    Object.keys(activeWorkItemScores).map(key => ({
        workItemId: activeWorkItemId,
        userId: key,
        value: activeWorkItemScores[key]
    }))
);

const vote = (
    state = [],
    action
) => {
    switch (action.type) {
        case RECEIVE_SPRINT_ESTIMATION_UPDATE:
            return onReceiveSprintEstimationUpdate(state, action);
        default:
            return state;
    }
};

export default vote;
