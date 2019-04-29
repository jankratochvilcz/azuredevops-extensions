import {
    all,
    fork
} from "redux-saga/effects";

import watchGetIterations from "./getIterations";
import watchGetTeam from "./getTeam";

export default function* root() {
    yield all([
        fork(watchGetIterations),
        fork(watchGetTeam)
    ]);
}
