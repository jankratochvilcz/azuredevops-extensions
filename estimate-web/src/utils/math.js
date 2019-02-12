import _ from "underscore";

export const sum = xs => (
    _.reduce(
        xs,
        (memo, num) => memo + num, 0
    )
);

export const average = xs => (
    sum(xs) / (xs.length === 0 ? 1 : xs.length));
