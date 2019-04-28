import _ from "underscore";

export const sum = xs => (
    _.reduce(
        xs,
        (memo, num) => memo + num, 0
    )
);

export const average = xs => {
    const sumOfXs = sum(xs);
    const coundOfXs = (xs.length === 0 ? 1 : xs.length);
    const averageOfXs = sumOfXs / coundOfXs;
    const roundedAverageOfXs = Math.round(averageOfXs * 10) / 10;
    return roundedAverageOfXs;
};
