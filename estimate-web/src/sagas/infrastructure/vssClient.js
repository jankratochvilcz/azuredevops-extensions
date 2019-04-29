export const VSS_WORK_REST_CLIENT = "TFS/Work/RestClient";
export const VSS_WORK_ITEM_TRACKING_REST_CLIENT = "TFS/WorkItemTracking/RestClient";
export const VSS_CORE_REST_CLIENT = "TFS/Core/RestClient";

export const workHttpClientGetter = x => x.WorkHttpClient;
export const workItemTrackingHttpClientGetter = x => x.WorkItemTrackingHttpClient;
export const coreHttpClientGetter = x => x.CoreHttpClient;

const executeOnClient = (clientPath, clientGetter, action) => new Promise((resolve, reject) => {
    VSS.require(["VSS/Service", clientPath], (vssService, tfsWebApi) => {
        try {
            const client = vssService.getCollectionClient(clientGetter(tfsWebApi));

            if (client) {
                const actionPromise = action(client);
                actionPromise
                    .then(x => {
                        resolve(x);
                    })
                    .catch(x => {
                        reject(x);
                    });
            } else {
                reject();
            }
        } catch (error) {
            reject(error);
        }
    });
});

export const executeOnWorkClient = action => (
    executeOnClient(VSS_WORK_REST_CLIENT, workHttpClientGetter, action)
);

export const executeOnWorkItemTrackingClient = action => (
    executeOnClient(VSS_WORK_ITEM_TRACKING_REST_CLIENT, workItemTrackingHttpClientGetter, action)
);

export const executeOnCoreClient = action => (
    executeOnClient(VSS_CORE_REST_CLIENT, coreHttpClientGetter, action)
);
