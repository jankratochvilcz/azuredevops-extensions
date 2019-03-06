import _ from "underscore";

import { mergeArraysUsingId } from "./merging";

describe("Merging arrays using ID", () => {
    const sampleInitialState = [
        {
            id: 1,
            name: "User A",
            email: "user@corporate.org",
            isConnected: false
        },
        {
            id: 2,
            name: "User B",
            email: "user2@corporate.org",
            isConnected: false
        }
    ];

    test("Should return elements of new state", () => {
        expect(mergeArraysUsingId([], sampleInitialState))
            .toEqual(sampleInitialState);
    });

    test("Should return previous state", () => {
        expect(mergeArraysUsingId(sampleInitialState, []))
            .toEqual(sampleInitialState);
    });

    test("Should merge states", () => {
        expect(mergeArraysUsingId([sampleInitialState[0]], [sampleInitialState[1]]))
            .toEqual(sampleInitialState);
    });

    test("Should update user", () => {
        const alteredUser = {
            id: 1,
            name: "User A - Renamed"
        };

        const userBeforeAlteration = _.find(
            sampleInitialState,
            x => x.id === alteredUser.id
        );

        const expectation = expect(mergeArraysUsingId(sampleInitialState, [alteredUser]));

        expectation.toHaveLength(2);
        expectation.toEqual(expect.arrayContaining([expect.objectContaining({
            name: alteredUser.name,
            email: userBeforeAlteration.email
        })]));
    });
});
