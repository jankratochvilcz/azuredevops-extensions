import _ from "underscore";

// eslint-disable-next-line import/prefer-default-export
export const orderedWorkItems = state => (
    _.sortBy(_.sortBy(
        state.workItem,
        x => x.stackRank
    ), x => x.id)
);
