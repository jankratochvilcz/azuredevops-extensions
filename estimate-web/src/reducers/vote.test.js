import vote from "./vote";
import { RECEIVE_VOTE } from "../actions/estimation";

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
});
