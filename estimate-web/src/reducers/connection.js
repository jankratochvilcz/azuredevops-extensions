import { STATUS_CHANGED } from "../actions/connection";

const connection = (state = {
    isConnected: false,
    isConnecting: false
}, action) => {
    switch (action.type) {
        case STATUS_CHANGED:
            return {
                isConnected: action.isConnected,
                isConnecting: action.isConnecting
            };
        default:
            return state;
    }
};

export default connection;
