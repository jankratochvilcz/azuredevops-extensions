import { connectionStarting } from "./connection";

export const REQUEST_GROUP_CONNECT = "ESTIMATION/REQUEST_GROUP_CONNECT";
export const requestGroupConnect = (iterationPath, userId) => ({
    type: REQUEST_GROUP_CONNECT,
    iterationPath,
    userId
});

export const REQUEST_GROUP_DISCONNECT = "ESTIMATION/REQUEST_GROUP_DISCONNECT";
export const requestGroupDisconnect = () => ({
    type: REQUEST_GROUP_DISCONNECT
});

export const REQUEST_VOTE = "ESTIMATION/REQUEST_VOTE";
export const requestVote = (userId, iterationPath, workItemId, score) => ({
    type: REQUEST_VOTE,
    sprintId: iterationPath,
    userId,
    workItemId,
    score
});
export const REQUEST_VOTES_REVEALED = "ESTIMATION/REQUEST_VOTES_REVEALED";
export const requestVotesRevealed = (iterationPath, userId, workItemId) => ({
    type: REQUEST_VOTES_REVEALED,
    sprintId: iterationPath,
    userId,
    workItemId
});

export const REQUEST_ACTIVEWORKITEM_CHANGED = "ESTIMATION/REQUEST_ACTIVEWORKITEM_CHANGED";
export const requestSwitchActiveWorkItem = (iterationPath, userId, workItemId) => ({
    type: REQUEST_ACTIVEWORKITEM_CHANGED,
    sprintId: iterationPath,
    userId,
    workItemId
});

export const connectToGroup = (iterationPath, userId) => dispatch => {
    VSS.getService(VSS.ServiceIds.Navigation).then(navigationService => {
        navigationService.setHash(iterationPath);
    });

    dispatch(connectionStarting());
    dispatch(requestGroupConnect(iterationPath, userId));
};

export const RECEIVE_SPRINT_ESTIMATION_UPDATE = "ESTIMATION/RECEIVE_SPRINT_ESTIMATION_UPDATE";
export const receiveSprintEstimationUpdate = (
    sprintId,
    userIds,
    activeWorkItemId,
    isActiveWorkItemRevealed,
    activeWorkItemScores,
    comittedNumericalScore
) => ({
    type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
    iterationPath: sprintId,
    userIds,
    activeWorkItemId,
    isActiveWorkItemRevealed,
    activeWorkItemScores,
    comittedNumericalScore
});
