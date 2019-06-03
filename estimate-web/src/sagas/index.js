import {
    all,
    fork
} from "redux-saga/effects";

import watchGetIterations from "./getIterations";
import watchGetTeam from "./getTeam";
import watchGetWorkItems from "./getWorkItems";
import watchUpdateWorkItem from "./updateWorkItem";
import watchGetComments from "./getComments";
import watchEstimation from "./estimation";

export default function* root() {
    yield all([
        fork(watchGetIterations),
        fork(watchGetTeam),
        fork(watchGetWorkItems),
        fork(watchGetComments),
        fork(watchUpdateWorkItem),
        fork(watchEstimation)
    ]);
}
