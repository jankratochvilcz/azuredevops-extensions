export const selectProjectRootUrl = state => `${state.applicationContext.collectionUri}${state.applicationContext.projectName}/`;
export const selectWorkItemRootUrl = state => `${selectProjectRootUrl(state)}_workitems/edit/`;
export const selectIterationUrl = (state, iterationPath) => `${selectProjectRootUrl(state)}_sprints/backlog/${state.applicationContext.teamName}/${iterationPath}`;
