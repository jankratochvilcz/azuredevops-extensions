import applicationContext from "./applicationContext";
import { RECEIVE_VOTES_REVEALED } from "../actions/estimation";

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
});
