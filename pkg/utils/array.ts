export async function arrayFromAsyncGenerator<T>(
    generator: AsyncGenerator<T>,
): Promise<T[]> {
    let items: T[] = [];
    for await (const item of generator) {
        items.push(item);
    }
    return items;
}

/**
 * Compares two arrays without considering the order of elements.
 * just check, if the two arrays have the same elements.
 */
export async function compareArraysWithoutOrder<T>(
    a: T[],
    b: T[],
): Promise<boolean> {
    if (a.length !== b.length) {
        return false;
    }

    const aSet = new Set(a);
    const bSet = new Set(b);

    if (aSet.size !== bSet.size) {
        return false;
    }

    for (const item of aSet) {
        if (!bSet.has(item)) {
            return false;
        }
    }

    return true;
}
