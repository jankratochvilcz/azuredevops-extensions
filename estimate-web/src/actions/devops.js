export const INITIALIZE_CONTEXT = "DEVOPS/INITIALIZE_CONTEXT";
export const initializeContext = () => {
    const context = VSS.getWebContext();

    return {
        type: INITIALIZE_CONTEXT,
        context: {
            teamId: context.team.id,
            teamName: context.team.name,
            projectId: context.project.id,
            projectName: context.project.name,
            userId: context.user.id,
            userEmail: context.user.email,
            userName: context.user.name,
            collectionUri: context.collection.uri
        }
    };
};

export const REQUEST_ITERATIONS = "DEVOPS/REQUEST_ITERATIONS";
export const requestIterations = () => ({
    type: REQUEST_ITERATIONS
});

export const RECEIVE_ITERATIONS = "DEVOPS/RECEIVE_ITERATIONS";
export const receiveIterations = iterations => ({
    type: RECEIVE_ITERATIONS,
    iterations: iterations
});

export const REQUEST_TEAM = "DEVOPS/REQUEST_TEAM";
export const requestTeam = postAction => ({
    type: REQUEST_TEAM,
    postAction
});

export const RECEIVE_TEAM = "DEVOPS/RECEIVE_TEAM";
export const receiveTeam = (teamId, team) => ({
    type: RECEIVE_TEAM,
    team,
    teamId
});

export const REQUEST_WORKITEMS = "DEVOPS/REQUEST_WORKITEMS";
export const requestWorkItems = iterationPath => ({
    type: REQUEST_WORKITEMS,
    iterationPath
});

export const RECEIVE_WORKITEMS = "DEVOPS/RECEIVE_WORKITEMS";
export const receiveWorkItems = (iterationPath, workItems) => ({
    type: RECEIVE_WORKITEMS,
    iterationPath,
    workItems
});

export const REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE = "DEVOPS/REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE";
export const requestWorkItemUpdateStoryPointsUpdate = (
    workItemId,
    storyPoints,
    iterationPath,
    userId
) => ({
    type: REQUEST_WORKITEM_UPDATE_STORYPOINTS_UPDATE,
    storyPoints,
    workItemId,
    iterationPath,
    userId
});

export const REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE = "DEVOPS/REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE";
export const requestWorkItemUpdateStoryPointsRemove = (workItemId, iterationPath, userId) => ({
    type: REQUEST_WORKITEM_UPDATE_STORYPOINTS_REMOVE,
    workItemId,
    iterationPath,
    userId
});

export const RECEIVE_WORKITEM_UPDATE = "DEVOPS/RECEIVE_WORKITEM_UPDATE";
export const receiveWorkItemUpdate = workItem => ({
    type: RECEIVE_WORKITEM_UPDATE,
    workItem: workItem
});
