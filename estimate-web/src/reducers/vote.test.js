import vote from "./vote";
import { RECEIVE_SPRINT_ESTIMATION_UPDATE } from "../actions/estimation";

describe("Vote reducer", () => {
    test("Should return initial state", () => {
        expect(vote(undefined, {})).toEqual([]);
    });

    test("Replaces existing vote", () => {
        const expectation = expect(vote([{
            userId: "1",
            workItemId: 11,
            value: "A"
        }], {
            type: RECEIVE_SPRINT_ESTIMATION_UPDATE,
            userId: "1",
            activeWorkItemId: 11,
            activeWorkItemScores: {
                1: "B"
            }
        }));

        expectation.toHaveLength(1);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            userId: "1",
            workItemId: 11,
            value: "B"
        })]));
    });
});
