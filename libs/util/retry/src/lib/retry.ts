/**
 * retry automatically retries to perform an asyncronous action.
 * @param fn - Must throw an error to indicate failure
 * @param maxAttempts
 * @param backoffAlgorithm - The algorithm used to calcualte the waiting time. Returns milliseconds
 */
export async function retry<Result>(
  fn: () => Promise<Result>,
  config: {
    maxAttempts: number
    backoffAlgorithm?: (attempt: number) => number
  },
): Promise<Result> {
  for (let attempt = 1; attempt <= config.maxAttempts; attempt += 1) {
    const backoff = config.backoffAlgorithm
      ? config.backoffAlgorithm(attempt)
      : Math.random() ** Math.min(attempt, 6) * 1000

    try {
      return await fn()
    } catch {
      await new Promise((resolve) => setTimeout(resolve, backoff))
    }
  }
  throw new Error(`Unable to perform action: ran out of retries.`)
}
