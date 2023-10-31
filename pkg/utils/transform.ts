/**
 * From lbs weight to kg weight. Returning a number with 2 decimal places
 * @param lbs
 * @returns
 */
export const lbsToKg = (lbs: number): number => {
    return Math.round((lbs / 2.2046) * 100) / 100;
};
