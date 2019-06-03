import { connectionStarting } from "./connection";
import { requestWorkItemGetComments } from "./devops";

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

export const RECEIVE_GROUP_UPDATED = "ESTIMATION/RECEIVE_GROUP_UPDATED";
export const receiveGroupUpdated = args => ({
    type: RECEIVE_GROUP_UPDATED,
    connectedUserIds: args.presentUserIds,
    activeWorkItemId: args.activeWorkItemId
});

export const REQUEST_VOTE = "ESTIMATION/REQUEST_VOTE";
export const requestVote = (userId, iterationPath, workItemId, value) => ({
    type: REQUEST_VOTE,
    groupName: iterationPath,
    userId,
    workItemId,
    value
});

export const RECEIVE_VOTE = "ESTIMATION/RECEIVE_VOTE";
export const receiveVote = args => ({
    type: RECEIVE_VOTE,
    iterationPath: args.groupName,
    userId: args.userId,
    value: args.value,
    workItemId: args.workItemId
});

export const REQUEST_VOTES_REVEALED = "ESTIMATION/REQUEST_VOTES_REVEALED";
export const requestVotesRevealed = (iterationPath, userId, workItemId) => ({
    type: REQUEST_VOTES_REVEALED,
    groupName: iterationPath,
    userId,
    workItemId
});

export const RECEIVE_VOTES_REVEALED = "ESTIMATION/RECEIVE_VOTES_REVEALED";
export const receiveVotesRevealed = args => ({
    type: RECEIVE_VOTES_REVEALED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

export const REQUEST_ACTIVEWORKITEM_CHANGED = "ESTIMATION/REQUEST_ACTIVEWORKITEM_CHANGED";
export const requestSwitchActiveWorkItem = (iterationPath, userId, workItemId) => ({
    type: REQUEST_ACTIVEWORKITEM_CHANGED,
    groupName: iterationPath,
    userId,
    workItemId
});

export const RECEIVE_ACTIVEWORKITEM_CHANGED = "ESTIMATION/RECEIVE_ACTIVEWORKITEM_CHANGED";
export const receiveActiveWorkItemChanged = args => ({
    type: RECEIVE_ACTIVEWORKITEM_CHANGED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

export const SELECTED_WORK_ITEM_CHANGED = "ESTIMATION/SELECTED_WORK_ITEM_CHANGED";
export const selectedWorkItemChanged = id => ({
    type: SELECTED_WORK_ITEM_CHANGED,
    selectedWorkItemId: id
});


export const RECEIVE_WORKITEM_SCORED = "ESTIMATION/RECEIVE_WORKITEM_SCORED";
export const receiveWorkItemScored = args => ({
    type: RECEIVE_WORKITEM_SCORED,
    workItemId: args.workItemId,
    storyPoints: args.value,
    iterationPath: args.groupName
});

export const REQUEST_WORKITEM_REFRESH_COMMENTS = "ESTIMATION/REQUEST_WORKITEM_REFRESH_COMMENTS";
export const requestWorkItemRefreshComments = args => ({
    type: REQUEST_WORKITEM_REFRESH_COMMENTS,
    workItemId: args.workItemId
});

export const receiveWorkItemRefreshComments = args => requestWorkItemGetComments(args.workItemId);

export const connectToGroup = (iterationPath, userId) => dispatch => {
    VSS.getService(VSS.ServiceIds.Navigation).then(navigationService => {
        navigationService.setHash(iterationPath);
    });

    dispatch(connectionStarting());
    dispatch(requestGroupConnect(iterationPath, userId));
};
