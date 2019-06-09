export const STATUS_CHANGED = "CONNECTION/STATUS_CHANGED";

export const connectionStarting = () => ({
    type: STATUS_CHANGED,
    isConnecting: true
});

export const disconnected = () => ({
    type: STATUS_CHANGED,
    isDisconnected: true,
    isConnecting: false
});
