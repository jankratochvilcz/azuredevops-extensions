import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { initializeIcons } from '@uifabric/icons';

VSS.init({
    setupModuleLoader: true,
    explicitNotifyLoaded: true,
    usePlatformScripts: true,
    usePlatformStyles: true,
    moduleLoaderConfig: {
        paths: {
            Scripts: 'scripts'
        }
    }
});

initializeIcons();

VSS.ready(function () {
    ReactDOM.render(
        <App />, 
        document.getElementById("root"));

    VSS.notifyLoadSucceeded();
});