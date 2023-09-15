/**
 * Find the closest match in an array of objects to a goal number
 * @param array The array of objects as input
 * @param goal The goal number - find the closest match to this number
 * @param itterator The key in the array of objects
 * @returns
 */
const closestsMatch = <T extends { [key: string]: any }>(
    array: T[],
    goal: number,
    itterator: string,
): T => {
    return array.reduce(function (prev, curr) {
        return Math.abs(curr[itterator] - goal) <
            Math.abs(prev[itterator] - goal)
            ? curr
            : prev;
    });
};

export { closestsMatch };
