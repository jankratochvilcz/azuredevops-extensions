import _ from "underscore";

// There will be more functions in the future, so disabling as default export
// eslint-disable-next-line import/prefer-default-export
export const mergeArrays = (oldArray, newArray, equalityFunction) => {
    const existingUsersToUpdate = oldArray
        .filter(x => _.some(newArray, y => equalityFunction(x, y)));

    const newUsers = newArray
        .filter(x => !_.some(existingUsersToUpdate, y => equalityFunction(x, y)));

    const unchangedUsers = oldArray
        .filter(x => !_.some(existingUsersToUpdate, y => equalityFunction(x, y)));

    const updatedUsers = existingUsersToUpdate
        .map(existingUser => ({
            ...existingUser,
            ..._.find(newArray, x => equalityFunction(x, existingUser))
        }));

    const mergedState = [
        ...unchangedUsers,
        ...updatedUsers,
        ...newUsers
    ];

    return mergedState;
};

export const mergeArraysUsingId = (oldArray, newArray) => (
    mergeArrays(oldArray, newArray, (x, y) => x.id === y.id));
