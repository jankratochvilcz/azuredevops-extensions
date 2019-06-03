import {
    takeEvery,
    select,
    put,
    call
} from "redux-saga/effects";
import { REQUEST_WORKITEM_GET_COMMENTS, receiveWorkItemComments } from "../actions/devops";
import { executeOnWorkItemTrackingClient } from "./infrastructure/vssClient";

function* getComments(action) {
    const { workItemId } = action;
    const { projectId } = yield select(state => state.applicationContext);

    const response = yield call(
        executeOnWorkItemTrackingClient,
        x => x.getComments(projectId, workItemId)
    );

    yield put(receiveWorkItemComments(workItemId, response.comments));
}

export default function* watchGetComments() {
    yield takeEvery(REQUEST_WORKITEM_GET_COMMENTS, getComments);
}
