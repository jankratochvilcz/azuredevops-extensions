import _ from "underscore";

import {
    fork,
    call,
    put,
    take
} from "redux-saga/effects";

import { executeOnWorkItemTrackingClient } from "./infrastructure/vssClient";

import { REQUEST_WORKITEMS, receiveWorkItems } from "../actions/devops";
import { normalizeWorkItem } from "./infrastructure/vssEntityNormalization";

const ESTIMATABLE_WORKITEMTYPES = ["Bug", "User Story"];
const NOT_ESTIMATABLE_WORKITEMSTATES = ["Removed"];

const getApplicableWorkItemsForScoring = workItems => (
    workItems
        .filter(x => _.some(ESTIMATABLE_WORKITEMTYPES, y => x.workItemType === y))
        .filter(x => !_.some(NOT_ESTIMATABLE_WORKITEMSTATES, y => x.state === y))
);

function* getWorkItems(iterationPath) {
    const wiql = {
        query: `SELECT [System.Id],\
        [Microsoft.VSTS.Common.StackRank],\
        [Microsoft.VSTS.Scheduling.StoryPoints],\
        [System.Title],[System.IterationPath],\
        [System.State] \
        FROM WorkItems \
        WHERE [System.IterationPath] \
        UNDER '${iterationPath}'`
    };

    const wiqlQueryResult = yield call(
        executeOnWorkItemTrackingClient,
        x => x.queryByWiql(wiql)
    );

    const workItemIds = wiqlQueryResult.workItems.map(x => x.id);

    const workItems = yield call(
        executeOnWorkItemTrackingClient,
        x => x.getWorkItems(workItemIds)
    );

    const normalizedWorkItems = workItems.map(x => normalizeWorkItem(x));
    const applicableWorkItems = getApplicableWorkItemsForScoring(normalizedWorkItems);

    yield put(receiveWorkItems(iterationPath, applicableWorkItems));
}

export default function* watchGetWorkItems() {
    while (true) {
        const { iterationPath } = yield take(REQUEST_WORKITEMS);
        yield fork(getWorkItems, iterationPath);
    }
}
