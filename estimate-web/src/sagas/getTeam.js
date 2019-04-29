import {
    fork,
    call,
    put,
    take,
    select
} from "redux-saga/effects";

import { executeOnCoreClient } from "./infrastructure/vssClient";

import { REQUEST_TEAM, receiveTeam } from "../actions";
import { normalizeTeamMember } from "./infrastructure/vssEntityNormalization";

function* getTeam(postAction) {
    const { teamId, projectId } = yield select(state => state.applicationContext);

    const team = yield call(
        executeOnCoreClient,
        x => x.getTeamMembersWithExtendedProperties(projectId, teamId)
    );

    const teamNormalized = team.map(x => normalizeTeamMember(x, teamId));

    yield put(receiveTeam(teamId, teamNormalized));

    if (postAction) {
        postAction();
    }
}

export default function* watchGetTeam() {
    while (true) {
        const { postAction } = yield take(REQUEST_TEAM);
        yield fork(getTeam, postAction);
    }
}
