/**
 * Small timing helpers shared by the mock services to simulate latency.
 */

/** Resolves after `ms` milliseconds. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves after a random duration within `[min, max]` milliseconds. */
export function randomDelay(min: number, max: number): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return delay(ms);
}
