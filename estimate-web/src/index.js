import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { initializeIcons } from "@uifabric/icons";
import { createStore, applyMiddleware } from "redux";

import App from "./App";
import reducer from "./reducers";

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
    const middleware = [ thunk ];

    const store = createStore(
        reducer,
        applyMiddleware(...middleware)
    );

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
        document.getElementById("root"));

    VSS.notifyLoadSucceeded();
});
