import applicationContext from "./applicationContext";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

describe("Application Context reducer", () => {
    test("Should return initial state", () => {
        expect(applicationContext(undefined, {})).not.toBeNull();
    });

    test("Processes RECEIVE_SPRINT_ESTIMATION_UPDATE", () => {
        expect(applicationContext(
            {
                activeWorkItemId: 2,
                isActiveWorkItemRevealed: false
            },
            {
                type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
                isActiveWorkItemRevealed: true,
                activeWorkItemId: 1
            }
        )).toMatchObject({
            activeWorkItemId: 1,
            isActiveWorkItemRevealed: true
        });
    });

    test("Marks IsConnecting as false if a group update is received", () => {
        expect(applicationContext({
            isConnecting: true
        }, {
            type: RECEIVE_SPRINT_ESTIMATION_UPDATE
        })).toMatchObject({
            isConnecting: false,
            isDisconnected: false
        });
    });
});
