import _ from "underscore"

// Synchronous actions
export const INITIALIZE_CONTEXT = "DEVOPS/INITIALIZE_CONTEXT";


// Asynchronous actions
export const REQUEST_ITERATIONS = "DEVOPS/REQUEST_ITERATIONS";
export const RECEIVE_ITERATIONS = "DEVOPS/RECEIVE_ITERATIONS";

export const initializeContext = () => ({
    type: INITIALIZE_CONTEXT,
    context: VSS.getWebContext()
});

const requestIterations = () => ({
    type: REQUEST_ITERATIONS
});

const receiveIterations = response => ({
    type: RECEIVE_ITERATIONS,
    iterations: _.sortBy(response, x => x.attributes.startDate).reverse()
});

export const getIterations = (teamId, projectId) => dispatch => {
    dispatch(requestIterations());

    var getTeamIterationsArg = {
        teamId,
        projectId
    };

    executeOnVssWorkClient(client => {
        client
            .getTeamIterations(getTeamIterationsArg)
            .then(result => dispatch(receiveIterations(result)));
    })
}

const executeOnVssWorkClient = action => {
    VSS.require(["VSS/Service", "TFS/Work/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
        var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkHttpClient);
        action(client);
    });
}