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
    REQUEST_GROUP_CONNECT,
    REQUEST_VOTE,
    REQUEST_GROUP_DISCONNECT,
    REQUEST_VOTES_REVEALED,
    REQUEST_ACTIVEWORKITEM_CHANGED,
    receiveSprintEstimationUpdate
} from "../actions/estimation";

import {
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE
} from "../actions/devops";

import { disconnected, STATUS_CHANGED } from "../actions/connection";

const REQUEST_EVENT_JOIN = "JoinSprintEstimation";
const CONNECTION_URL = "https://localhost:44378/sprint_estimation";
// const CONNECTION_URL = "https://doist-estimate-api.azurewebsites.net/sprint_estimation";
const CONNECTION_LOG_LEVEL = LogLevel.Information;

// Handlers of actions that should be sent to SingalR
const invokableActions = [
    { action: REQUEST_VOTE, event: "ScoreWorkItem" },
    { action: REQUEST_ACTIVEWORKITEM_CHANGED, event: "ChangeActiveWorkItem" },
    { action: REQUEST_VOTES_REVEALED, event: "RevealWorkItemScores" },
    {
        action: REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
        event: "CommitNumericalScore",
        argsTransform: args => ({
            sprintId: args.iterationPath,
            score: args.storyPoints,
            userId: args.userId,
            workItemId: args.workItemId
        })
    },
    {
        action: REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE,
        event: "CommitNumericalScore",
        argsTransform: args => ({
            sprintId: args.iterationPath,
            score: null,
            userId: args.userId,
            workItemId: args.workItemId
        })
    }
];

/**
 *  Creates a channel that will generate actions based on incoming socket events.
 */
const createConnectionEventsChannel = connection => eventChannel(emitter => {
    connection.on(
        "sprintEstimationUpdated",
        ({
            sprintId,
            userIds,
            activeWorkItemId,
            isActiveWorkItemRevealed,
            activeWorkItemScores,
            comittedNumericalScore
        }) => emitter(receiveSprintEstimationUpdate(
            sprintId,
            userIds,
            activeWorkItemId,
            isActiveWorkItemRevealed,
            activeWorkItemScores,
            comittedNumericalScore
        ))
    );

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
                    sprintId: iterationPath,
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
