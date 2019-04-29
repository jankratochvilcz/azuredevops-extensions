import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { initializeIcons } from "@uifabric/icons";
import { createStore, applyMiddleware } from "redux";

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

VSS.ready(function () {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = [
        sagaMiddleware,
        thunk
    ];

    const store = createStore(
        reducer,
        applyMiddleware(...middleware)
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
