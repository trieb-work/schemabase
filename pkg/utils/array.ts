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
 * Just compare two arrays with each other using sort and stringify.
 * Return true, if the arrays entries are equal, otherwise false.
 */
export function compareArrays<T>(a: T[], b: T[]): boolean {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}
