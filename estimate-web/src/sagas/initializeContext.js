import { take } from "redux-saga/effects";

import LogRocket from "logrocket";

import { INITIALIZE_CONTEXT } from "../actions/devops";

const identifyOnLogRocket = (userId, userName, userEmail) => (
    LogRocket.identify(userId, {
        name: userName,
        email: userEmail
    })
);

export default function* watchInitializeContext() {
    while (true) {
        const { context } = yield take(INITIALIZE_CONTEXT);
        const { userEmail, userId, userName } = context;

        identifyOnLogRocket(userId, userName, userEmail);
    }
}
