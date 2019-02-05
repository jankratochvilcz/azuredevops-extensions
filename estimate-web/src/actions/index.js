import _ from "underscore"

// Synchronous actions
export const INITIALIZE_CONTEXT = "DEVOPS/INITIALIZE_CONTEXT";


// Asynchronous actions
export const REQUEST_ITERATIONS = "DEVOPS/REQUEST_ITERATIONS";
export const RECEIVE_ITERATIONS = "DEVOPS/RECEIVE_ITERATIONS";

export const REQUEST_TEAM = "DEVOPS/REQUEST_TEAM";
export const RECEIVE_TEAM = "DEVOPS/RECEIVE_TEAM";

export const REQUEST_WORKITEMS = "DEVOPS/REQUEST_WORKITEMS";
export const RECEIVE_WORKITEMS = "DEVOPS/RECEIVE_WORKITEMS";

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

const requestTeam = () => ({
    type: REQUEST_TEAM
});

const receiveTeam = (teamId, response) => ({
    type: RECEIVE_TEAM,
    team: response.map(x => ({
        ...x.identity,
        connected: false
    })),
    teamId: teamId
});

const requestWorkItems = () => ({
    type: REQUEST_WORKITEMS
});

const receiveWorkItems = (iterationPath, result) => ({
    type: RECEIVE_WORKITEMS,
    iterationPath: iterationPath,
    workItems: result.map(x => ({
        id: x.id,
        url: x.url,
        title: x.fields["System.Title"],
        storyPoints: x.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
        stackRank: x.fields["Microsoft.VSTS.Common.StackRank"],
        createdBy: x.fields["System.CreatedBy"],
        assignedTo: x.fields["System.AssignedTo"],
        description: x.fields["System.Description"] || x.fields["Microsoft.VSTS.TCM.ReproSteps"],
        workItemType: x.fields["System.WorkItemType"]
    }))
})

export const getIterations = (teamId, projectId, postAction) => dispatch => {
    dispatch(requestIterations());

    var getTeamIterationsArg = {
        teamId,
        projectId
    };

    executeOnVssWorkClient(client => {
        client
            .getTeamIterations(getTeamIterationsArg)
            .then(result => dispatch(receiveIterations(result)));
    });
}

export const getTeam = (teamId, projectId, postAction) => dispatch => {
    dispatch(requestTeam());

    executeOnVssCoreClient(client => {
        client
            .getTeamMembersWithExtendedProperties(projectId, teamId)
            .then(result => {
                dispatch(receiveTeam(teamId, result));
                if(postAction != null) {
                    postAction();
                }
            });
    });
}

export const getWorkItems = iterationPath => dispatch => {
    dispatch(requestWorkItems());

    var wiql = {
        query: "SELECT [System.Id],[Microsoft.VSTS.Common.StackRank],[Microsoft.VSTS.Scheduling.StoryPoints],[System.Title] FROM WorkItems WHERE [System.IterationPath] UNDER '"
            + iterationPath + "'"
    };

    executeOnVssWorkItemTrackingClient(client => {
        client
            .queryByWiql(wiql)
            .then(result => {
                var workItemIds = result.workItems.map(x => x.id);
                client.getWorkItems(workItemIds)
                    .then(result => dispatch(receiveWorkItems(iterationPath, result)));
            });
    });
}

const executeOnVssWorkClient = action => {
    VSS.require(["VSS/Service", "TFS/Work/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
        var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkHttpClient);
        action(client);
    });
}

const executeOnVssWorkItemTrackingClient = action => {
    VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
        var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);
        action(client);
    });
}

const executeOnVssCoreClient = action => {
    VSS.require(["VSS/Service", "TFS/Core/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
        var client = VSS_Service.getCollectionClient(TFS_Wit_WebApi.CoreHttpClient);
        action(client);
    });
}