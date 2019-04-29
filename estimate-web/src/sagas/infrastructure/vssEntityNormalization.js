export const normalizeWorkItem = x => ({
    id: x.id,
    url: x.url,
    title: x.fields["System.Title"],
    storyPoints: x.fields["Microsoft.VSTS.Scheduling.StoryPoints"],
    stackRank: x.fields["Microsoft.VSTS.Common.StackRank"],
    createdBy: x.fields["System.CreatedBy"],
    assignedTo: x.fields["System.AssignedTo"],
    description: x.fields["System.Description"] || x.fields["Microsoft.VSTS.TCM.ReproSteps"],
    workItemType: x.fields["System.WorkItemType"],
    iterationPath: x.fields["System.IterationPath"],
    state: x.fields["System.State"]
});

export const normalizeTeamMember = (teamMember, teamId) => ({
    ...teamMember.identity,
    isConnected: false,
    teamId: teamId
});
