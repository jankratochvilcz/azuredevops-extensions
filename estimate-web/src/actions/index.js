import _ from "underscore";

// Synchronous actions
export const INITIALIZE_CONTEXT = "DEVOPS/INITIALIZE_CONTEXT";


// Asynchronous actions
export const REQUEST_ITERATIONS = "DEVOPS/REQUEST_ITERATIONS";
export const RECEIVE_ITERATIONS = "DEVOPS/RECEIVE_ITERATIONS";

export const REQUEST_TEAM = "DEVOPS/REQUEST_TEAM";
export const RECEIVE_TEAM = "DEVOPS/RECEIVE_TEAM";

export const REQUEST_WORKITEMS = "DEVOPS/REQUEST_WORKITEMS";
export const RECEIVE_WORKITEMS = "DEVOPS/RECEIVE_WORKITEMS";
export const RECEIVE_WORKITEM_UPDATE = "DEVOPS/RECEIVE_WORKITEM_UPDATE";

const executeOnVssWorkClient = action => {
    VSS.require(["VSS/Service", "TFS/Work/RestClient"], (vssService, tfsWebApi) => {
        const client = vssService.getCollectionClient(tfsWebApi.WorkHttpClient);
        action(client);
    });
};

const executeOnVssWorkItemTrackingClient = action => {
    VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], (vssService, tfsWebApi) => {
        const client = vssService.getCollectionClient(tfsWebApi.WorkItemTrackingHttpClient);
        action(client);
    });
};

const executeOnVssCoreClient = action => {
    VSS.require(["VSS/Service", "TFS/Core/RestClient"], (vssService, tfsWebApi) => {
        const client = vssService.getCollectionClient(tfsWebApi.CoreHttpClient);
        action(client);
    });
};

const parseWorkItem = apiWorkItem => ({
    id: apiWorkItem.id,
    url: apiWorkItem.url,
    title: apiWorkItem.fields["System.Title"],
    storyPoints: apiWorkItem.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
    stackRank: apiWorkItem.fields["Microsoft.VSTS.Common.StackRank"],
    createdBy: apiWorkItem.fields["System.CreatedBy"],
    assignedTo: apiWorkItem.fields["System.AssignedTo"],
    description: apiWorkItem.fields["System.Description"] || apiWorkItem.fields["Microsoft.VSTS.TCM.ReproSteps"],
    workItemType: apiWorkItem.fields["System.WorkItemType"],
    iterationPath: apiWorkItem.fields["System.IterationPath"]
});

export const initializeContext = () => {
    const context = VSS.getWebContext();

    return {
        type: INITIALIZE_CONTEXT,
        context: {
            teamId: context.team.id,
            projectId: context.project.id,
            projectName: context.project.name,
            userId: context.user.id,
            collectionUri: context.collection.uri
        }
    };
};

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
        isConnected: false,
        teamId: teamId,
        votes: {}
    })),
    teamId: teamId
});

const requestWorkItems = () => ({
    type: REQUEST_WORKITEMS
});

const receiveWorkItems = (iterationPath, result) => ({
    type: RECEIVE_WORKITEMS,
    iterationPath: iterationPath,
    workItems: result.map(x => parseWorkItem(x))
});

const receiveWorkitemUpdate = (workItem, iterationPath) => ({
    type: RECEIVE_WORKITEM_UPDATE,
    workItem: workItem,
    iterationPath: iterationPath
});

const updateWorkItem = (payload, iterationPath, workItemId) => dispatch => {
    executeOnVssWorkItemTrackingClient(client => {
        client
            .updateWorkItem(payload, workItemId)
            .then(workItem => dispatch(receiveWorkitemUpdate(
                parseWorkItem(workItem),
                iterationPath
            )));
    });
};

export const getIterations = (teamId, projectId) => dispatch => {
    dispatch(requestIterations());

    const getTeamIterationsArg = {
        teamId,
        projectId
    };

    executeOnVssWorkClient(client => {
        client
            .getTeamIterations(getTeamIterationsArg)
            .then(result => dispatch(receiveIterations(result)));
    });
};

export const getTeam = (teamId, projectId, postAction) => dispatch => {
    dispatch(requestTeam());

    executeOnVssCoreClient(client => {
        client
            .getTeamMembersWithExtendedProperties(projectId, teamId)
            .then(result => {
                dispatch(receiveTeam(teamId, result));
                if (postAction != null) {
                    postAction();
                }
            });
    });
};

export const getWorkItems = iterationPath => dispatch => {
    dispatch(requestWorkItems());

    const wiql = {
        query: `SELECT [System.Id],[Microsoft.VSTS.Common.StackRank],[Microsoft.VSTS.Scheduling.StoryPoints],[System.Title],[System.IterationPath] FROM WorkItems WHERE [System.IterationPath] UNDER '${iterationPath}'`
    };

    executeOnVssWorkItemTrackingClient(client => {
        client
            .queryByWiql(wiql)
            .then(wiqlResult => {
                const workItemIds = wiqlResult.workItems.map(x => x.id);
                client.getWorkItems(workItemIds)
                    .then(workItemsResult => dispatch(receiveWorkItems(
                        iterationPath,
                        workItemsResult
                    )));
            });
    });
};

export const updateStoryPoints = (workItemId, storyPoints, iterationPath) => (
    dispatch => updateWorkItem([
        {
            op: "add",
            path: "/fields/Microsoft.VSTS.Scheduling.StoryPoints",
            value: storyPoints
        }], iterationPath, workItemId)(dispatch));

export const removeStoryPoints = (workItemId, iterationPath) => (
    dispatch => updateWorkItem([
        {
            op: "remove",
            path: "/fields/Microsoft.VSTS.Scheduling.StoryPoints"
        }], iterationPath, workItemId)(dispatch));
