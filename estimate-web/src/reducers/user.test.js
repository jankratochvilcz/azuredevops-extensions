import user from "./user";
import { STATUS_CHANGED } from "../actions/connection";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

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
            type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
            userIds: [2]
        }));

        expectation.toHaveLength(2);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 2,
            isConnected: true
        })]));
    });

    test("Doesn't mark unrelated user as connected", () => {
        const expectation = expect(user(sampleInitialState, {
            type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
            userIds: [2]
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
            type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
            userIds: []
        }));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 1,
            isConnected: false
        })]));
    });

    test("Marks everyone as disconnected on disconnection", () => {
        const expectation = expect(user([
            {
                id: 1,
                isConnected: true
            }
        ], {
            type: STATUS_CHANGED,
            isDisconnected: true
        }));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            id: 1,
            isConnected: false
        })]));
    });
});
