import theoretically from "jest-theories";
import { average } from "./math";

describe("match", () => {
    const theories = [
        {
            xs: [],
            expected: 0
        },
        {
            xs: [1, 2],
            expected: 1.5
        },
        {
            xs: [1, 2, 2],
            expected: 1.7
        }
    ];

    theoretically("Return correct average of {expected}", theories, theory => {
        const actual = average(theory.xs);
        expect(actual).toEqual(theory.expected);
    });
});
