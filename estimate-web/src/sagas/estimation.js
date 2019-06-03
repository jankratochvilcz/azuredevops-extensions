/* eslint-disable no-loop-func */
/* eslint-disable func-names */

// Inspired by https://gist.github.com/ebakhtarov/4cc4c3f537c9cc4f6e87de4c492131b4

import {
    fork,
    take,
    all,
    call,
    put,
    race
} from "redux-saga/effects";

import { eventChannel } from "@redux-saga/core";
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

import {
    receiveGroupUpdated,
    receiveVote,
    receiveVotesRevealed,
    receiveActiveWorkItemChanged,
    receiveWorkItemRefreshComments,
    REQUEST_GROUP_CONNECT,
    REQUEST_VOTE,
    REQUEST_GROUP_DISCONNECT,
    REQUEST_VOTES_REVEALED,
    REQUEST_ACTIVEWORKITEM_CHANGED,
    REQUEST_WORKITEM_REFRESH_COMMENTS,
    receiveWorkItemScored
} from "../actions/estimation";

import {
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE
} from "../actions/devops";

import { disconnected, STATUS_CHANGED } from "../actions/connection";

const REQUEST_EVENT_JOIN = "join";
const CONNECTION_URL = "https://localhost:44378/estimate";
// const CONNECTION_URL = "https://doist-estimate-api.azurewebsites.net/estimate";
const CONNECTION_LOG_LEVEL = LogLevel.Information;

// Handlers of messages incoming from SignalR
const receiveEventHandlers = [
    { name: "groupUpdated", actionFactory: receiveGroupUpdated },
    { name: "voted", actionFactory: receiveVote },
    { name: "revealed", actionFactory: receiveVotesRevealed },
    { name: "switched", actionFactory: receiveActiveWorkItemChanged },
    { name: "scored", actionFactory: receiveWorkItemScored },
    { name: "refreshComments", actionFactory: receiveWorkItemRefreshComments }
];

// Handlers of actions that should be sent to SignalR
const invokableActions = [
    { action: REQUEST_VOTE, event: "vote" },
    { action: REQUEST_WORKITEM_REFRESH_COMMENTS, event: "refreshComments" },
    { action: REQUEST_ACTIVEWORKITEM_CHANGED, event: "switchSelectedWorkItem" },
    { action: REQUEST_VOTES_REVEALED, event: "reveal" },
    {
        action: REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
        event: "score",
        argsTransform: args => ({
            groupName: args.iterationPath,
            value: args.storyPoints,
            userId: args.userId,
            workItemId: args.workItemId
        })
    },
    {
        action: REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE,
        event: "score",
        argsTransform: args => ({
            groupName: args.iterationPath,
            value: null,
            userId: args.userId,
            workItemId: args.workItemId
        })
    }
];

/**
 *  Creates a channel that will generate actions based on incoming socket events.
 */
const createConnectionEventsChannel = connection => eventChannel(emitter => {
    receiveEventHandlers.forEach(({ name, actionFactory }) => connection.on(
        name,
        args => emitter(actionFactory(args))
    ));

    connection.onclose(() => emitter(disconnected()));

    return () => connection.stop();
});

/**
 * Connects to a given connection and joins the user group.
 * Returns a promise of { connectionError } in case of error or { } in case of success.
 */
const connect = (connection, iterationPath, userId) => new Promise(resolve => {
    connection
        .start()
        .then(() => {
            connection
                .invoke(REQUEST_EVENT_JOIN, {
                    groupName: iterationPath,
                    userId: userId
                })
                .then(() => resolve({ }))
                .catch(ex => resolve({ connectionError: ex }));
        })
        .catch(ex => {
            resolve({ connectionError: ex });
        });
});

/**
 * Wraps the connect function into a sequence for easier consumption within the saga.
 */
function* establishConnection(connection, iterationPath, userId) {
    const { connectionError } = yield call(connect, connection, iterationPath, userId);

    if (connectionError != null) {
        yield put(disconnected());
    }
}

/**
 * Executes a Redux action on a WebSocket connection.
 */
const executeOnConnection = (actionName, eventName, argsTransform, connection) => function* () {
    while (true) {
        const args = yield take(actionName);

        const transformedArgs = argsTransform ? argsTransform(args) : args;

        connection.invoke(eventName, transformedArgs);
    }
};

/**
 * Consumes incoming socket actions and generates Redux actions from them.
 */
function* watchIncoming(connectionChannel) {
    while (true) {
        const payload = yield take(connectionChannel);
        yield put(payload);
    }
}

/**
 * Comsumes applicable Redux actions and sends them to the socket.
 */
function* watchOutgoing(connection) {
    const invokableActionForks = invokableActions
        .map((
            {
                action,
                event,
                argsTransform
            }
        ) => executeOnConnection(action, event, argsTransform, connection))
        .map(x => fork(x));

    yield all(invokableActionForks);
}

/**
 * Composes sagas that operate on an active connection,
 * including ones that take action in case of the connection closing.
 */
function* watchConnection(connection) {
    const connectionChannel = yield call(createConnectionEventsChannel, connection);

    while (true) {
        // In practical terms, this makes sure the saga doesn't attempt
        // to send incoming actions to a closed connection.
        const { cancel } = yield race({
            task: all([
                call(watchIncoming, connectionChannel),
                call(watchOutgoing, connection)
            ]),
            cancel: take(REQUEST_GROUP_DISCONNECT),
            disconnected: take(action => action.type === STATUS_CHANGED && action.isDisconnected)
        });

        if (cancel || disconnected) {
            connectionChannel.close();
            return;
        }
    }
}

/**
 * Connects to the socket after recieving the correct message.
 */
function* watchRequestGroupConnect() {
    while (true) {
        const { iterationPath, userId } = yield take(REQUEST_GROUP_CONNECT);

        const connection = new HubConnectionBuilder()
            .withUrl(CONNECTION_URL)
            .configureLogging(CONNECTION_LOG_LEVEL)
            .build();

        yield all([
            fork(watchConnection, connection, iterationPath, userId),
            fork(establishConnection, connection, iterationPath, userId)
        ]);
    }
}

export default function* watchEstimation() {
    yield all([
        fork(watchRequestGroupConnect)
    ]);
}
