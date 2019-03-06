import user from "./user";
import { RECEIVE_GROUP_UPDATED } from "../actions/estimation";

describe("User reducer", () => {
    const sampleInitialState = [
        {
            id: 1,
            isConnected: false
        },
        {
            id: 2,
            isConnected: false
        }
    ];

    test("Should return initial state", () => {
        expect(user(undefined, {})).toEqual([]);
    });

    test("Should mark user as connected", () => {
        const expectation = expect(user(sampleInitialState, {
            type: RECEIVE_GROUP_UPDATED,
            connectedUserIds: [2]
        }));

        expectation.toHaveLength(2);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 2,
            isConnected: true
        })]));
    });

    test("Doesn't mark unrelated user as connected", () => {
        const expectation = expect(user(sampleInitialState, {
            type: RECEIVE_GROUP_UPDATED,
            connectedUserIds: [2]
        }));

        expectation.toHaveLength(2);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 1,
            isConnected: false
        })]));
    });

    test("Marks user as disconnected", () => {
        const expectation = expect(user([
            {
                id: 1,
                isConnected: true
            }
        ], {
            type: RECEIVE_GROUP_UPDATED,
            connectedUserIds: []
        }));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 1,
            isConnected: false
        })]));
    });
});
