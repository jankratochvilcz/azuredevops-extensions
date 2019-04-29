import {
    all,
    fork
} from "redux-saga/effects";

import watchGetIterations from "./getIterations";

export default function* root() {
    yield all([
        fork(watchGetIterations)
    ]);
}
