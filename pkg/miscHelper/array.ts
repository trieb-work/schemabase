export async function arrayFromAsyncGenerator<T>(
  generator: AsyncGenerator<T>,
): Promise<T[]> {
  let items: T[] = [];
  for await (const item of generator) {
    items.push(item);
  }
  return items;
}
