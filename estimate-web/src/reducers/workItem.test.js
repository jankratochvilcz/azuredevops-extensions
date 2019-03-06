import workItem from "./workItem";

describe("Work item reducer", () => {
    test("Should return initial state", () => {
        expect(workItem(undefined, {})).toEqual([]);
    });
});
