import { AppError } from "../errors/app.error.js";

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label = "operation",
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new AppError(`${label} timed out after ${timeoutMs}ms`, "TIMEOUT"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
