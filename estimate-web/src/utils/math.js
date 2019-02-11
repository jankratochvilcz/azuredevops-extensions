import _ from "underscore";

export const average = xs => (
    _.reduce(
        xs,
        (memo, num) => memo + num, 0
    ) / (xs.length === 0 ? 1 : xs.length));
