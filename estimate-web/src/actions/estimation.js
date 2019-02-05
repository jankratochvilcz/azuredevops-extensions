import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'

export const RECEIVE_GROUP_UPDATED = "ESTIMATION/RECEIVE_GROUP_UPDATED"

const groupUpdatedEventName = "groupUpdated";

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

export const connectToGroup = (iterationPath, userId) => dispatch => {
    connection
        .start()
        .then(() => connection.invoke("join", {
            groupName: iterationPath,
            userId: userId
        }));

    connection.on(
        groupUpdatedEventName,
        args => dispatch(receiveGroupUpdated(args.presentUserIds)));
}