import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { initializeIcons } from '@uifabric/icons';

console.log("VSS init");

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
    console.log("VSS ready");

    ReactDOM.render(
        <App />, 
        document.getElementById("root"));

    VSS.notifyLoadSucceeded();
});