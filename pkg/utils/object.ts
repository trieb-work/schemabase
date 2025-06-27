/**
 * Recursively sorts an object's keys to ensure consistent serialization
 * regardless of the environment.
 *
 * @param obj - The object to sort keys for
 * @returns A new object with sorted keys (or the original value if not an object)
 */
export function sortObjectKeys<T>(obj: T): T {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys) as unknown as T;

    return Object.keys(obj)
        .sort()
        .reduce<Record<string, any>>((result, key) => {
            result[key] = sortObjectKeys((obj as Record<string, any>)[key]);
            return result;
        }, {}) as T;
}
