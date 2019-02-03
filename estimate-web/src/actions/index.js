export const REQUEST_ITERATIONS = "DEVOPS/REQUEST_ITERATIONS";
export const RECEIVE_ITERATIONS = "DEVOPS/RECEIVE_ITERATIONS";
export const INITIALIZE_CONTEXT = "DEVOPS/INITIALIZE_CONTEXT";

export const initializeContext = () => ({
    type: INITIALIZE_CONTEXT,
    context: VSS.getWebContext()
})