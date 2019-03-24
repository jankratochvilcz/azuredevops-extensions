import user from "./user";

describe("Iteration reducer", () => {
    test("Should return initial state", () => {
        expect(user(undefined, {})).toEqual([]);
    });
});
