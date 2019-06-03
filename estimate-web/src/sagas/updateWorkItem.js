import {
    all,
    fork,
    call,
    put,
    take
} from "redux-saga/effects";

import { executeOnWorkItemTrackingClient } from "./infrastructure/vssClient";

import {
    receiveWorkItemUpdate,
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
    REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE,
    REQUEST_WORKITEM_ADD_COMMENT
} from "../actions/devops";

import { requestWorkItemRefreshComments } from "../actions/estimation";

import { normalizeWorkItem } from "./infrastructure/vssEntityNormalization";

function* updateWorkItem(payload, workItemId) {
    const updatedWorkItem = yield call(
        executeOnWorkItemTrackingClient,
        x => x.updateWorkItem([payload], workItemId)
    );

    const normalizedUpdatedWorkItem = normalizeWorkItem(updatedWorkItem);

    put(receiveWorkItemUpdate(normalizedUpdatedWorkItem));
}

function* watchUpdateStoryPoints() {
    while (true) {
        const { workItemId, storyPoints } = yield take(REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE);
        yield fork(
            updateWorkItem,
            {
                op: "add",
                path: "/fields/Microsoft.VSTS.Scheduling.StoryPoints",
                value: storyPoints
            },
            workItemId
        );
    }
}

function* watchRemoveStoryPoints() {
    while (true) {
        const { workItemId } = yield take(REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE);
        yield fork(
            updateWorkItem,
            {
                op: "remove",
                path: "/fields/Microsoft.VSTS.Scheduling.StoryPoints"
            },
            workItemId
        );
    }
}

function* watchAddComment() {
    while (true) {
        const { workItemId, comment } = yield take(REQUEST_WORKITEM_ADD_COMMENT);
        yield call(
            updateWorkItem,
            {
                op: "add",
                path: "/fields/System.History",
                value: comment
            },
            workItemId
        );
        yield put(requestWorkItemRefreshComments(workItemId));
    }
}

export default function* watchUpdateWorkItem() {
    yield all([
        fork(watchUpdateStoryPoints),
        fork(watchRemoveStoryPoints),
        fork(watchAddComment)
    ]);
}
