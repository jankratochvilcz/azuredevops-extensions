import { connectionStarting } from "./connection";

export const REQUEST_GROUP_CONNECT = "ESTIMATION/REQUEST_GROUP_CONNECT";
export const REQUEST_GROUP_DISCONNECT = "ESTIMATION/REQUEST_GROUP_DISCONNECT";

export const RECEIVE_GROUP_UPDATED = "ESTIMATION/RECEIVE_GROUP_UPDATED";
export const REQUEST_VOTE = "ESTIMATION/REQUST_VOTE";
export const RECEIVE_VOTE = "ESTIMATION/RECEIVE_VOTE";

export const REQUEST_VOTES_REVEALED = "ESTIMATION/REQUEST_VOTES_REVEALED";
export const RECEIVE_VOTES_REVEALED = "ESTIMATION/RECEIVE_VOTES_REVEALED";

export const REQUEST_ACTIVEWORKITEM_CHANGED = "REQUEST/ACTIVEWORKITEM_CHANGED";
export const RECEIVE_ACTIVEWORKITEM_CHANGED = "RECEIVE/ACTIVEWORKITEM_CHANGED";

export const receiveGroupUpdated = (connectedUserIds, activeWorkItemId) => ({
    type: RECEIVE_GROUP_UPDATED,
    connectedUserIds: connectedUserIds,
    activeWorkItemId: activeWorkItemId
});

export const receiveVote = args => ({
    type: RECEIVE_VOTE,
    iterationPath: args.groupName,
    userId: args.userId,
    value: args.value,
    workItemId: args.workItemId
});

export const receiveVotesRevealed = args => ({
    type: RECEIVE_VOTES_REVEALED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

export const receiveActiveWorkItemChanged = args => ({
    type: RECEIVE_ACTIVEWORKITEM_CHANGED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

export const requestGroupConnect = (iterationPath, userId) => ({
    type: REQUEST_GROUP_CONNECT,
    iterationPath,
    userId
});

export const requestGroupDisconnect = () => ({
    type: REQUEST_GROUP_DISCONNECT
});

export const requestVote = (userId, iterationPath, workItemId, value) => ({
    type: REQUEST_VOTE,
    iterationPath,
    userId,
    workItemId,
    value
});

export const requestSwitchActiveWorkItem = (iterationPath, userId, workItemId) => ({
    type: REQUEST_ACTIVEWORKITEM_CHANGED,
    iterationPath,
    userId,
    workItemId
});

export const requestVotesRevealed = (iterationPath, userId, workItemId) => ({
    type: REQUEST_VOTES_REVEALED,
    iterationPath,
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
