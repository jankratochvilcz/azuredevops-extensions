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

import { disconnected } from "../actions/connection";
import {
    receiveGroupUpdated,
    receiveVote,
    receiveVotesRevealed,
    receiveActiveWorkItemChanged,
    REQUEST_GROUP_CONNECT,
    requestGroupConnect,
    REQUEST_VOTE,
    REQUEST_GROUP_DISCONNECT,
    REQUEST_VOTES_REVEALED,
    REQUEST_ACTIVEWORKITEM_CHANGED
} from "../actions/estimation";

const REQUEST_EVENT_JOIN = "join";

// const CONNECTION_URL = "https://localhost:44378/estimate";
const CONNECTION_URL = "https://doist-estimate-api.azurewebsites.net/estimate";
const CONNECTION_LOG_LEVEL = LogLevel.Information;

const receiveEventHandlers = [
    { name: "groupUpdated", actionFactory: receiveGroupUpdated },
    { name: "voted", actionFactory: receiveVote },
    { name: "revealed", actionFactory: receiveVotesRevealed },
    { name: "switched", actionFactory: receiveActiveWorkItemChanged }
];

const invokableActions = [
    { action: REQUEST_VOTE, event: "vote" },
    { action: REQUEST_ACTIVEWORKITEM_CHANGED, event: "switchSelectedWorkItem" },
    { action: REQUEST_VOTES_REVEALED, event: "reveal" }
];

/**
 *  Creates a channel that will generate actions based on incoming socket events.
 */
const createConnectionChannel = connection => eventChannel(emitter => {
    receiveEventHandlers.forEach(({ name, actionFactory }) => connection.on(
        name,
        args => emitter(actionFactory(args))
    ));

    return () => connection.close();
});

/**
 * Executes a Redux action on a WebSocket connection.
 */
const executeOnConnection = (actionName, eventName, connection) => function* () {
    while (true) {
        const args = yield take(actionName);
        connection.invoke(eventName, args);
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
        .map(({ action, event }) => executeOnConnection(action, event, connection))
        .map(x => fork(x));

    yield all(invokableActionForks);
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

        connection.onclose(() => {
            setTimeout(() => put(requestGroupConnect(iterationPath, userId)), 2000);
            put(disconnected());
        });

        connection
            .start()
            .then(() => {
                connection
                    .invoke(REQUEST_EVENT_JOIN, {
                        groupName: iterationPath,
                        userId: userId
                    })
                    .catch(() => put(disconnected()));
            })
            .catch(x => {
                console.log(x);
                setTimeout(() => put(requestGroupConnect(iterationPath, userId)), 2000);
            });

        const connectionChannel = yield call(createConnectionChannel, connection);

        const { cancel } = yield race({
            task: all([
                call(watchIncoming, connectionChannel),
                call(watchOutgoing, connection)
            ]),
            cancel: take(REQUEST_GROUP_DISCONNECT)
        });

        if (cancel) {
            connectionChannel.close();
        }
    }
}

export default function* watchEstimation() {
    yield all([
        fork(watchRequestGroupConnect)
    ]);
}
