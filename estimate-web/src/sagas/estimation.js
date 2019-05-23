/* eslint-disable no-loop-func */
/* eslint-disable func-names */

// Heavily inspired by https://gist.github.com/ebakhtarov/4cc4c3f537c9cc4f6e87de4c492131b4

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

const groupUpdatedEventName = "groupUpdated";
const votedEventName = "voted";
const revealedEventName = "revealed";
const switchedActiveWorkItemEventName = "switched";

const clientBuilder = new HubConnectionBuilder();
// const url = "https://localhost:44378/estimate";
const url = "https://doist-estimate-api.azurewebsites.net/estimate";
const logLevel = LogLevel.Information;

const createConnectionChannel = connection => eventChannel(emitter => {
    connection.on(
        groupUpdatedEventName,
        args => emitter(receiveGroupUpdated(args.presentUserIds, args.activeWorkItemId))
    );

    connection.on(
        votedEventName,
        args => emitter(receiveVote(args))
    );

    connection.on(
        revealedEventName,
        args => emitter(receiveVotesRevealed(args))
    );

    connection.on(
        switchedActiveWorkItemEventName,
        args => emitter(receiveActiveWorkItemChanged(args))
    );

    return () => connection.close();
});

function* backgroundTask(connectionChannel) {
    while (true) {
        const payload = yield take(connectionChannel);
        yield put(payload);
    }
}

const executeRequestVote = connection => function* () {
    while (true) {
        const {
            iterationPath,
            userId,
            workItemId,
            value
        } = yield take(REQUEST_VOTE);

        connection.invoke("vote", {
            groupName: iterationPath,
            userId: userId,
            value: value,
            workItemId: workItemId
        });
    }
};

const executeSwitchSelectedWorkItem = connection => function* () {
    while (true) {
        const {
            iterationPath,
            userId,
            workItemId
        } = yield take(REQUEST_ACTIVEWORKITEM_CHANGED);

        connection.invoke("switchSelectedWorkItem", {
            groupName: iterationPath,
            userId,
            workItemId
        });
    }
};

const executeRevealVotes = connection => function* () {
    while (true) {
        const {
            iterationPath,
            userId,
            workItemId
        } = yield take(REQUEST_VOTES_REVEALED);

        connection.invoke("reveal", {
            groupName: iterationPath,
            userId,
            workItemId
        });
    }
};

function* executeTask(connection) {
    yield all([
        fork(executeRequestVote(connection)),
        fork(executeRevealVotes(connection)),
        fork(executeSwitchSelectedWorkItem(connection))
    ]);
}

function* watchRequestGroupConnect() {
    while (true) {
        const { iterationPath, userId } = yield take(REQUEST_GROUP_CONNECT);

        const connection = clientBuilder
            .withUrl(url)
            .configureLogging(logLevel)
            .build();

        connection.onclose(() => {
            setTimeout(() => put(requestGroupConnect(iterationPath, userId)), 2000);
            put(disconnected());
        });

        connection
            .start()
            .then(() => {
                connection
                    .invoke("join", {
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
                call(backgroundTask, connectionChannel),
                call(executeTask, connection)
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
