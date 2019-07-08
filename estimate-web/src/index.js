/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { initializeIcons } from "@uifabric/icons";
import { createStore, applyMiddleware, compose } from "redux";
import LogRocket from "logrocket";

import App from "./App";
import reducer from "./reducers";
import rootSaga from "./sagas";

VSS.init({
    setupModuleLoader: true,
    explicitNotifyLoaded: true,
    usePlatformScripts: true,
    usePlatformStyles: true,
    moduleLoaderConfig: {
        paths: {
            Scripts: "scripts"
        }
    }
});

initializeIcons();

LogRocket.init("u5npfg/estimate-develop", {
    network: {
        // Since socket comms are not captured, this option is not very useful in our case
        isEnabled: false
    }
});

VSS.ready(function () {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = [
        sagaMiddleware,
        thunk
        // Will be turned on when data scrubbing is implemented
        // LogRocket.reduxMiddleware()
    ];

    /* eslint-disable no-underscore-dangle */
    // Setup Redux dev tools.
    // Instructions: https://github.com/zalmoxisus/redux-devtools-extension
    // This allows to inspect the state, actions and other aspects of the app
    // in the browser dev tools.The enhancer is needed so the extension can find and
    // connect to our store.
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    /* eslint-enable */

    const store = createStore(
        reducer,
        composeEnhancers(applyMiddleware(...middleware))
    );

    sagaMiddleware.run(rootSaga);

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("root")
    );

    VSS.notifyLoadSucceeded();
});
