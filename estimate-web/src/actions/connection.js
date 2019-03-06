export const STATUS_CHANGED = "CONNECTION/STATUS_CHANGED";

export const connectionStarting = () => ({
    type: STATUS_CHANGED,
    isConnecting: true
});

export const connected = () => ({
    type: STATUS_CHANGED,
    isConnecting: false
});

export const disconnected = () => ({
    type: STATUS_CHANGED,
    isDisconnected: true
});
