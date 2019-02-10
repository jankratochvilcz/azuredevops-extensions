import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

export const RECEIVE_GROUP_UPDATED = "ESTIMATION/RECEIVE_GROUP_UPDATED";
export const REQUEST_VOTE = "ESTIMATION/REQUST_VOTE";
export const RECEIVE_VOTE = "ESTIMATION/RECEIVE_VOTE";

const groupUpdatedEventName = "groupUpdated";
const votedEventName = "voted";

const clientBuilder = new HubConnectionBuilder();
const url = "https://localhost:44378/estimate";
const logLevel = LogLevel.Information;

const connection = clientBuilder
    .withUrl(url)
    .configureLogging(logLevel)
    .build();

const receiveGroupUpdated = connectedUserIds => ({
    type: RECEIVE_GROUP_UPDATED,
    connectedUserIds: connectedUserIds
});

const receiveVote = args => ({
    type: RECEIVE_VOTE,
    iterationPath: args.groupName,
    userId: args.userId,
    value: args.value,
    workItemId: args.workItemId
});

export const requestVote = (userId, iterationPath, workItemId, value) => {
    connection.invoke("vote", {
        groupName: iterationPath,
        userId: userId,
        value: value,
        workItemId: workItemId
    });
};

export const connectToGroup = (iterationPath, userId) => dispatch => {
    connection
        .start()
        .then(() => connection.invoke("join", {
            groupName: iterationPath,
            userId: userId
        }));

    connection.on(
        groupUpdatedEventName,
        args => dispatch(receiveGroupUpdated(args.presentUserIds))
    );

    connection.on(
        votedEventName,
        args => dispatch(receiveVote(args))
    );
};
