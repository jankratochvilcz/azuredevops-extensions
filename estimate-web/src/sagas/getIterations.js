import _ from "underscore";

import {
    fork,
    call,
    put,
    take,
    select
} from "redux-saga/effects";

import { executeOnWorkClient } from "./infrastructure/vssClient";

import { REQUEST_ITERATIONS, receiveIterations } from "../actions/devops";

function* getIterations() {
    const { teamId, projectId } = yield select(state => state.applicationContext);

    const iterations = yield call(
        executeOnWorkClient,
        x => x.getTeamIterations({
            teamId,
            projectId
        })
    );

    const sortedIterations = _.sortBy(
        iterations,
        x => x.attributes.startDate
    ).reverse();

    yield put(receiveIterations(sortedIterations));
}

export default function* watchGetIterations() {
    while (true) {
        yield take(REQUEST_ITERATIONS);
        yield fork(getIterations);
    }
}
