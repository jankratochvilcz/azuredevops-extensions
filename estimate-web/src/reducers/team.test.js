import team from "./team";
import { RECEIVE_TEAM } from "../actions/devops";

const sampleInitialState = [1, 2];

describe("Team reducer", () => {
    test("Should return initial state", () => {
        expect(team(undefined, {})).toEqual([]);
    });

    test("Should return all teams", () => {
        expect(team(undefined, {
            type: RECEIVE_TEAM,
            teamId: 1
        })).toEqual([1]);
    });

    test("Should return previous state", () => {
        expect(team(sampleInitialState, {})).toEqual(sampleInitialState);
    });

    test("Should merge states", () => {
        expect(team(
            [1],
            {
                type: RECEIVE_TEAM,
                teamId: 2
            }
        )).toEqual([1, 2]);
    });
});
