import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { connectionStarting, disconnected } from "./connection";

export const RECEIVE_GROUP_UPDATED = "ESTIMATION/RECEIVE_GROUP_UPDATED";
export const REQUEST_VOTE = "ESTIMATION/REQUST_VOTE";
export const RECEIVE_VOTE = "ESTIMATION/RECEIVE_VOTE";
export const RECEIVE_VOTES_REVEALED = "ESTIMATION/RECEIVE_VOTES_REVEALED";

export const REQUEST_ACTIVEWORKITEM_CHANGED = "REQUEST/ACTIVEWORKITEM_CHANGED";
export const RECEIVE_ACTIVEWORKITEM_CHANGED = "RECEIVE/ACTIVEWORKITEM_CHANGED";

const groupUpdatedEventName = "groupUpdated";
const votedEventName = "voted";
const revealedEventName = "revealed";
const switchedActiveWorkItemEventName = "switched";

const clientBuilder = new HubConnectionBuilder();
// const url = "https://localhost:44378/estimate";
const url = "https://doist-estimate-api.azurewebsites.net/estimate";
const logLevel = LogLevel.Information;

const connection = clientBuilder
    .withUrl(url)
    .configureLogging(logLevel)
    .build();

const receiveGroupUpdated = (connectedUserIds, activeWorkItemId) => ({
    type: RECEIVE_GROUP_UPDATED,
    connectedUserIds: connectedUserIds,
    activeWorkItemId: activeWorkItemId
});

const receiveVote = args => ({
    type: RECEIVE_VOTE,
    iterationPath: args.groupName,
    userId: args.userId,
    value: args.value,
    workItemId: args.workItemId
});

const receiveVotesRevealed = args => ({
    type: RECEIVE_VOTES_REVEALED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

const receiveActiveWorkItemChanged = args => ({
    type: RECEIVE_ACTIVEWORKITEM_CHANGED,
    workItemId: args.workItemId,
    iterationPath: args.groupName
});

export const requestVote = (userId, iterationPath, workItemId, value) => {
    connection.invoke("vote", {
        groupName: iterationPath,
        userId: userId,
        value: value,
        workItemId: workItemId
    });
};

export const revealVotes = (userId, iterationPath, workItemId) => {
    connection.invoke("reveal", {
        groupName: iterationPath,
        userId: userId,
        workItemId: workItemId
    });
};

export const switchActiveWorkItem = (userId, iterationPath, workItemId) => {
    connection.invoke("switchSelectedWorkItem", {
        groupName: iterationPath,
        userId: userId,
        workItemId: workItemId
    });

    return receiveActiveWorkItemChanged({
        workItemId: workItemId,
        iterationPath: iterationPath
    });
};

export const connect = (iterationPath, userId) => dispatch => {
    dispatch(connectionStarting());

    connection
        .start()
        .then(() => {
            connection
                .invoke("join", {
                    groupName: iterationPath,
                    userId: userId
                })
                .catch(() => dispatch(disconnected()));
        })
        .catch(x => {
            console.log(x);
            setTimeout(() => dispatch(connect(iterationPath, userId)), 2000);
        });
};

const registerConnectionHandlers = (iterationPath, userId) => dispatch => {
    connection.off(groupUpdatedEventName);
    connection.off(votedEventName);
    connection.off(revealedEventName);
    connection.off(switchedActiveWorkItemEventName);

    connection.onclose(() => {
        dispatch(disconnected());
        setTimeout(() => dispatch(connect(iterationPath, userId)), 2000);
    });

    connection.on(
        groupUpdatedEventName,
        args => dispatch(receiveGroupUpdated(args.presentUserIds, args.activeWorkItemId))
    );

    connection.on(
        votedEventName,
        args => dispatch(receiveVote(args))
    );

    connection.on(
        revealedEventName,
        args => dispatch(receiveVotesRevealed(args))
    );

    connection.on(
        switchedActiveWorkItemEventName,
        args => dispatch(receiveActiveWorkItemChanged(args))
    );
};

export const connectToGroup = (iterationPath, userId) => dispatch => {
    dispatch(connectionStarting());

    connect(iterationPath, userId)(dispatch);
    registerConnectionHandlers(iterationPath, userId)(dispatch);
};
