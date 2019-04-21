import applicationContext from "./applicationContext";
import { RECEIVE_VOTES_REVEALED, RECEIVE_ACTIVEWORKITEM_CHANGED, RECEIVE_GROUP_UPDATED } from "../actions/estimation";

describe("Application Context reducer", () => {
    test("Should return initial state", () => {
        expect(applicationContext(undefined, {})).not.toBeNull();
    });

    test("Updates reveal status of current work item", () => {
        expect(applicationContext(
            {
                activeWorkItemId: 1,
                isActiveWorkItemRevealed: false
            },
            {
                type: RECEIVE_VOTES_REVEALED,
                workItemId: 1
            }
        )).toMatchObject({
            activeWorkItemId: 1,
            isActiveWorkItemRevealed: true
        });
    });

    test("Doesn't reveal status of current work item if bad work item ID", () => {
        expect(applicationContext(
            {
                activeWorkItemId: 1,
                isActiveWorkItemRevealed: false
            },
            {
                type: RECEIVE_VOTES_REVEALED,
                workItemId: 2
            }
        )).toMatchObject({
            activeWorkItemId: 1,
            isActiveWorkItemRevealed: false
        });
    });

    test("Resets revealed status when a selected work item changes", () => {
        expect(applicationContext({
            activeWorkItemId: 1,
            isActiveWorkItemRevealed: true
        }, {
            type: RECEIVE_ACTIVEWORKITEM_CHANGED,
            workItemId: 2
        })).toMatchObject({
            isActiveWorkItemRevealed: false
        });
    });

    test("Doesnt reset reveal status if active work item stays the same", () => {
        expect(applicationContext({
            activeWorkItemId: 1,
            isActiveWorkItemRevealed: true
        }, {
            type: RECEIVE_ACTIVEWORKITEM_CHANGED,
            workItemId: 1
        })).toMatchObject({
            isActiveWorkItemRevealed: true
        });
    });

    test("Marks IsConnecting as false if a group update is received", () => {
        expect(applicationContext({
            isConnecting: true
        }, {
            type: RECEIVE_GROUP_UPDATED
        })).toMatchObject({
            isConnecting: false
        });
    });
});