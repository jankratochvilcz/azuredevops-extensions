import vote from "./vote";
import { RECEIVE_VOTE, RECEIVE_ACTIVEWORKITEM_CHANGED } from "../actions/estimation";

describe("Vote reducer", () => {
    test("Should return initial state", () => {
        expect(vote(undefined, {})).toEqual([]);
    });

    test("Replaces existing vote", () => {
        const expectation = expect(vote([{
            userId: 1,
            workItemId: 11,
            value: "A"
        }], {
            type: RECEIVE_VOTE,
            userId: 1,
            workItemId: 11,
            value: "B"
        }));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            userId: 1,
            workItemId: 11,
            value: "B"
        })]));
    });

    test("Removes votes when switching to a work item", () => {
        const originalState = [
            {
                workItemId: 1
            },
            {
                workItemId: 2
            }
        ];

        const expectation = expect(vote(
            originalState,
            {
                type: RECEIVE_ACTIVEWORKITEM_CHANGED,
                workItemId: 1
            }
        ));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            workItemId: 2
        })]));
    });
});
